'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
    const { appointmentId, workerPhone, cancellationReason } = event;

    // 安全校验
    if (!workerPhone) {
        return { success: false, code: 'AUTH_FAILED', message: '操作失败，无法确认师傅身份' };
    }
    if (!appointmentId) {
        return { success: false, code: 'PARAM_ERROR', message: '缺少预约ID' };
    }
    if (!cancellationReason || !cancellationReason.trim()) {
        return { success: false, code: 'PARAM_ERROR', message: '必须提供取消原因' };
    }

    const t = Date.now(); // 统一操作时间戳

    try {
        // 1. 获取预约信息
        const appointmentRes = await db.collection('appointments').doc(appointmentId).get();
        if (appointmentRes.data.length === 0) {
            return { success: false, message: '找不到该预约记录' };
        }

        const appointment = appointmentRes.data[0];
        // 2. 权限和状态校验
        if (appointment.workerPhone !== workerPhone) {
            return { success: false, code: 'PERMISSION_DENIED', message: '无权操作该预约' };
        }
        if (appointment.status !== 'confirmed') {
            return { success: false, message: '该预约当前状态无法取消' };
        }
        
        // 3. 定义工人取消时的资金分配（全额退款，无补偿和平台费）
        const total_fee = appointment.total_fee;
        const refundInfo = {
            userRefundAmount: total_fee,
            workerCompensation: 0,
            platformFee: 0,
            refundNo: null,
            refundAt: null
        };

        // 4. 调用已改造的、通用的退款函数
        const refundRes = await uniCloud.callFunction({
            name: 'refundAppointment',
            data: {
                orderId: appointment.orderId,
                totalFee: total_fee,
                refundFee: refundInfo.userRefundAmount,
                refundReason: `工人取消：${cancellationReason}`
            }
        });
        
        // 5. 严格检查退款结果
        if (!refundRes.result || !refundRes.result.success) {
            console.error('工人取消场景-退款失败：', refundRes.result);
            // 退款失败是严重错误，应终止流程
            return { success: false, message: refundRes.result.message || '退款接口调用失败' };
        }
        
        // 6. 将返回的退款凭证记录到 refundInfo 对象中
        refundInfo.refundNo = refundRes.result.refundNo;
        refundInfo.refundAt = refundRes.result.refundAt;

        // 7. 一次性更新所有预约状态和统一的财务信息
        await db.collection('appointments').doc(appointmentId).update({
            status: 'cancelled_by_worker',
            payStatus: 'REFUNDED',
            cancellationReason: cancellationReason,
            cancelledAt: t,
            refundInfo: refundInfo // 存入统一的财务对象
        });

// 【修改后】8. 发送取消预约短信通知用户
try {
  const smsNotifyRes = await uniCloud.callFunction({
    name: 'sendSmsCode',
    data: {
      eventType: 'worker_cancel',
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
    console.warn('【cancelAppointmentByWorker】取消短信通知发送失败:', smsNotifyRes.result.message);
  }
} catch (smsErr) {
  console.error('【cancelAppointmentByWorker】调用 sendSmsCode 云函数异常:', smsErr);
}

        // 9. 发送聊天通知 (此部分逻辑保持不变)
        const userPhone = appointment.userPhone;
        const users = [workerPhone, userPhone].sort();
        const chatSessionRes = await db.collection('ChatSession')
            .where({ users: users })
            .limit(1)
            .get();

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

        const workerInfoRes = await db.collection('UserInfo')
            .where({ phoneNumber: workerPhone })
            .get();
        const workerInfo = workerInfoRes.data[0] || {};
        const avatarUrl = workerInfo.avatar || '/static/images/avatar-placeholder.png';
        const name = workerInfo.name || '师傅';

        const messageContent = `您的预约已被师傅取消，取消原因为：${cancellationReason}`;
        const messageData = {
            type: 'text',
            sender: workerPhone,
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
            [`unreadCount.${userPhone}`]: dbCmd.inc(1)
        });

        return { success: true, message: '预约已成功取消并通知用户' };

    } catch (err) {
        console.error('cancelAppointmentByWorker Error:', err);
        return { success: false, code: 'DB_ERROR', message: '操作失败，请稍后重试' };
    }
};
