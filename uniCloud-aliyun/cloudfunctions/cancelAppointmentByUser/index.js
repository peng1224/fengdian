'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
	 console.log('云函数 cancelAppointmentByUser 接收到的 event:', event);
    const { appointmentId, cancellationReason, userId } = event;

    // 参数校验
    if (!userId) {
        return { success: false, code: 'AUTH_FAILED', message: '操作失败，无法确认用户身份' };
    }
    if (!appointmentId) {
        return { success: false, code: 'PARAM_ERROR', message: '缺少预约ID' };
    }
    if (!cancellationReason || !cancellationReason.trim()) {
        return { success: false, code: 'PARAM_ERROR', message: '必须提供取消原因' };
    }

    const t = Date.now(); // 统一操作时间

    try {
        // 1. 获取预约信息
        const appointmentRes = await db.collection('appointments').doc(appointmentId).get();
        // 修正：确保正确访问数据，doc().get() 返回的是一个包含data属性的对象，data属性是一个数组
        if (!appointmentRes.data || appointmentRes.data.length === 0) {
            return { success: false, message: '找不到该预约记录' };
        }
        const appointment = appointmentRes.data[0]; // 获取实际的预约对象

        // 2. 权限和状态校验 (校验是否为用户本人)
        if (appointment.userId !== userId) {
            return { success: false, code: 'PERMISSION_DENIED', message: '无权操作该预约' };
        }
        
        // 【新增】重要的：新增时间校验
        // 如果预约的预计结束时间已经过去，则无法取消
        if (appointment.expectedEndTime && appointment.expectedEndTime <= t) {
            console.warn(`[cancelAppointmentByUser] 预约 ${appointmentId} 已过预计结束时间 (${new Date(appointment.expectedEndTime).toISOString()})，无法取消。当前时间: ${new Date(t).toISOString()}`);
            return { success: false, message: '服务已开始或已结束，无法取消。如有疑问请联系客服。' };
        }
        
        // 只有 'confirmed' 状态的预约可以被用户取消
        if (appointment.status !== 'confirmed') {
            return { success: false, message: '该预约当前状态无法取消' };
        }

        // 3. 核心逻辑：分段退款计算 (保持不变)
        const total_fee = appointment.total_fee;
        const serviceTime = new Date(`${appointment.serviceDate} ${appointment.serviceHour}`).getTime();
        const hoursUntilService = (serviceTime - t) / (1000 * 60 * 60);

        let payStatus = 'NO_REFUND'; // 默认支付状态
        const refundInfo = { // 初始化统一的财务对象
            userRefundAmount: 0,
            workerCompensation: 0,
            platformFee: 0,
            refundNo: null,
            refundAt: null
        };

        if (hoursUntilService > 24) {
            // > 24小时: 全额退款
            refundInfo.userRefundAmount = total_fee;
            payStatus = 'REFUNDED';
        } else if (hoursUntilService >= 12) {
            // 12-24小时: 退70%，工人20%，平台10%
            refundInfo.userRefundAmount = Math.round(total_fee * 0.7);
            refundInfo.workerCompensation = Math.round(total_fee * 0.2);
            refundInfo.platformFee = total_fee - refundInfo.userRefundAmount - refundInfo.workerCompensation;
            payStatus = 'PARTIALLY_REFUNDED';
        } else if (hoursUntilService >= 2) {
            // 2-12小时: 退50%，工人40%，平台10%
            refundInfo.userRefundAmount = Math.round(total_fee * 0.5);
            refundInfo.workerCompensation = Math.round(total_fee * 0.4);
            refundInfo.platformFee = total_fee - refundInfo.userRefundAmount - refundInfo.workerCompensation;
            payStatus = 'PARTIALLY_REFUNDED';
        } else {
            // < 2小时或已开始: 不退款，工人80%，平台20%
            refundInfo.userRefundAmount = 0;
            refundInfo.workerCompensation = Math.round(total_fee * 0.8);
            refundInfo.platformFee = total_fee - refundInfo.workerCompensation;
            payStatus = 'NO_REFUND';
        }

        // 4. 如果计算后需要给用户退款，则调用退款函数
        if (refundInfo.userRefundAmount > 0) {
            const refundRes = await uniCloud.callFunction({
                name: 'refundAppointment',
                data: {
                    orderId: appointment.orderId,
                    totalFee: total_fee,
                    refundFee: refundInfo.userRefundAmount,
                    refundReason: `用户取消：${cancellationReason}`
                }
            });

            if (!refundRes.result || !refundRes.result.success) {
                console.error('用户取消-退款失败:', refundRes.result);
                // 事务回滚点，如果退款失败，整个取消操作应该失败
                return { success: false, message: refundRes.result.message || '退款接口调用失败' };
            }
            // 记录退款凭证
            refundInfo.refundNo = refundRes.result.refundNo;
            refundInfo.refundAt = refundRes.result.refundAt;
        }

        // 5. [重要] 如果产生了工人补偿金，计入待结算表
        if (refundInfo.workerCompensation > 0) {
            await db.collection('worker_settlements').add({
                workerId: appointment.workerId,
                workerPhone: appointment.workerPhone,
                amount: refundInfo.workerCompensation,
                type: 'compensation',
                orderId: appointment.orderId,
                appointmentId: appointment._id,
                createdAt: t,
                status: 'pending'
            });
        }
        
        // 6. 一次性更新预约单的所有状态和财务信息
        await db.collection('appointments').doc(appointmentId).update({
            status: 'cancelled_by_user',
            payStatus: payStatus,
            cancellationReason: cancellationReason,
            cancelledAt: t,
            refundInfo: refundInfo
        });
        
// 【修改后】7. 发送取消预约短信通知工人
try {
  const smsNotifyRes = await uniCloud.callFunction({
    name: 'sendSmsCode',
    data: {
      eventType: 'user_cancel',
      appointment: {
        workerPhone: appointment.workerPhone,
        userPhone: appointment.userPhone,
        serviceDate: appointment.serviceDate,
        serviceHour: appointment.serviceHour,
        cancellationReason: cancellationReason
      }
    }
  });
  if (!smsNotifyRes.result.success) {
    console.warn('【cancelAppointmentByUser】取消短信通知发送失败:', smsNotifyRes.result.message);
  }
} catch (smsErr) {
  console.error('【cancelAppointmentByUser】调用 sendSmsCode 云函数异常:', smsErr);
}


        // 8. 发送聊天通知 (此部分逻辑保持不变)
        const userPhone = appointment.userPhone;
        const workerPhone = appointment.workerPhone;
        const users = [userPhone, workerPhone].sort();
        const chatSessionRes = await db.collection('ChatSession').where({ users }).limit(1).get();

        let sessionId;
        if (chatSessionRes.data.length > 0) {
            sessionId = chatSessionRes.data[0]._id;
        } else {
            const addSessionRes = await db.collection('ChatSession').add({
                users: users,
                lastMessage: '我们已经成为好友，开始聊天吧！',
                lastTime: Date.now(),
                unreadCount: {},
                createdAt: new Date()
            });
            sessionId = addSessionRes.id;
        }

        const avatarUrl = '/static/images/avatar-placeholder.png';
        const name = '客户';

        const messageContent = `您的预约已被客户取消，取消原因为：${cancellationReason}`;
        const messageData = {
            type: 'text',
            sender: userPhone,
            avatarUrl: avatarUrl,
            name: name,
            sessionId: sessionId,
            message: messageContent,
            timestamp: Date.now(),
            isRevoked: false,
            isSystemMessage: true
        };
        await db.collection('ChatMessages').add(messageData);

        await db.collection('ChatSession').doc(sessionId).update({
            lastMessage: messageContent,
            lastTime: Date.now(),
            [`unreadCount.${workerPhone}`]: dbCmd.inc(1)
        });

        return { success: true, message: '预约已成功取消' };

    } catch (err) {
        console.error('cancelAppointmentByUser Error:', err);
        return { success: false, code: 'DB_ERROR', message: '操作失败，请稍后重试' };
    }
};
