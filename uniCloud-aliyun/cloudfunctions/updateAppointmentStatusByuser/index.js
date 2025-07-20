// 云函数：updateAppointmentStatusByuser
'use strict';
const db = uniCloud.database();
const _ = db.command; // 保持您原有的 db.command 引入

// 定义常量：收益分配规则 (费率保持不变，总服务费将从预约中动态获取)
const WECHAT_FEE_RATE = 0.006; // 微信支付手续费率 (0.6%)
const PLATFORM_SHARE_RATE_AFTER_WECHAT = 0.10; // 平台在扣除微信手续费后的分成比例 (10%)

exports.main = async (event, context) => {
    const { appointmentId, status } = event;

    console.log('[updateAppointmentStatusByuser] 云函数开始执行。');
    console.log('[updateAppointmentStatusByuser] 接收参数：', { appointmentId, status });

    if (!appointmentId || !status) {
        console.error('[updateAppointmentStatusByuser] 参数校验失败：预约ID或状态缺失。');
        return {
            success: false,
            message: '缺少参数'
        };
    }

    // --- 新增：启动数据库事务，确保操作原子性 ---
    const transaction = await db.startTransaction();
    console.log('[updateAppointmentStatusByuser] 数据库事务已启动。');

    try {
        // 1. 查询预约详情，获取结算所需信息 (包括 total_fee)
        console.log(`[updateAppointmentStatusByuser] 查询预约: ${appointmentId}`);
        const appointmentRes = await transaction.collection('appointments').doc(appointmentId).get();
        const appointment = appointmentRes.data;
        console.log('[updateAppointmentStatusByuser] 预约查询结果:', appointment);

        if (!appointment) {
            console.error(`[updateAppointmentStatusByuser] 预约ID ${appointmentId} 未找到。`);
            await transaction.rollback(); // 回滚事务
            return { success: false, message: '预约未找到' };
        }

        // 2. 检查预约当前状态，防止重复结算或处理已取消/已完成的预约
        if (appointment.status === 'completed') {
            console.warn(`[updateAppointmentStatusByuser] 预约 ${appointmentId} 已经完成，无需重复处理。`);
            await transaction.rollback(); // 回滚事务
            return { success: true, message: '预约已完成，无需重复操作' }; // 视为成功，但无实际更新
        }
        if (appointment.status === 'cancelled') {
            console.warn(`[updateAppointmentStatusByuser] 预约 ${appointmentId} 已取消，无法完成。`);
            await transaction.rollback(); // 回滚事务
            return { success: false, message: '预约已取消，无法完成' };
        }

        // --- 保持原有逻辑：更新 appointments 状态，但现在在事务中执行 ---
        console.log(`[updateAppointmentStatusByuser] 更新预约 ${appointmentId} 状态为 ${status}...`);
        const updateApptRes = await transaction.collection('appointments').doc(appointmentId).update({
            status,
            updatedAt: Date.now(),
            ...(status === 'completed' && { completedAt: Date.now() }) // 如果是完成状态，记录完成时间
        });
        console.log('[updateAppointmentStatusByuser] 预约状态更新结果:', updateApptRes);

        if (updateApptRes.updated !== 1) {
            console.error(`[updateAppointmentStatusByuser] 更新预约 ${appointmentId} 状态失败，更新数量不为1。`);
            await transaction.rollback(); // 回滚事务
            return { success: false, message: '更新预约状态失败' };
        }

        // --- 新增：如果状态更新为 'completed'，则进行收益结算 ---
        if (status === 'completed') {
            // 获取当前预约的服务费总额 (单位：分)
            const currentServiceFeeFen = appointment.total_fee; 
            
            if (typeof currentServiceFeeFen !== 'number' || currentServiceFeeFen <= 0) {
                console.error(`[updateAppointmentStatusByuser] 预约 ${appointmentId} 的 total_fee 无效或为0: ${currentServiceFeeFen}`);
                await transaction.rollback();
                return { success: false, message: '预约服务费无效，无法结算' };
            }

            // 4. 计算收益分配
            const weChatFee = Math.round(currentServiceFeeFen * WECHAT_FEE_RATE);
            const netFeeAfterWeChat = currentServiceFeeFen - weChatFee;
            const platformShare = Math.round(netFeeAfterWeChat * PLATFORM_SHARE_RATE_AFTER_WECHAT);
            const workerShare = netFeeAfterWeChat - platformShare;

            console.log(`[updateAppointmentStatusByuser] 收益分配计算：`);
            console.log(`  总服务费 (动态获取): ${currentServiceFeeFen} 分`);
            console.log(`  微信手续费: ${weChatFee} 分`);
            console.log(`  扣除微信后净额: ${netFeeAfterWeChat} 分`);
            console.log(`  平台分成: ${platformShare} 分`);
            console.log(`  工人分成: ${workerShare} 分`);

            // 5. 创建工人结算记录
            console.log(`[updateAppointmentStatusByuser] 为工人 ${appointment.workerId} 创建结算记录...`);
            const addSettlementRes = await transaction.collection('worker_settlements').add({
                workerId: appointment.workerId,
                workerPhone: appointment.workerPhone, // 从预约中获取工人电话
                amount: workerShare, // 工人应得金额
                type: 'service_completion', // 收益类型：完成服务
                orderId: appointment.orderId, // 关联订单ID
                appointmentId: appointment._id, // 关联预约ID
                createdAt: Date.now(),
                status: 'pending' // 待提现状态
            });
            console.log('[updateAppointmentStatusByuser] 工人结算记录创建结果:', addSettlementRes);

            if (!addSettlementRes.id) {
                console.error('[updateAppointmentStatusByuser] 创建工人结算记录失败，未返回ID。');
                await transaction.rollback(); // 回滚事务
                return { success: false, message: '创建工人结算记录失败' };
            }
        }

        // --- 新增：提交事务 ---
        console.log('[updateAppointmentStatusByuser] 尝试提交事务...');
        await transaction.commit();
        console.log('[updateAppointmentStatusByuser] 事务提交成功。');

        return {
            success: true,
            message: status === 'completed' ? '服务已完成，收益已结算' : '预约状态更新成功' // 根据状态返回不同消息
        };

    } catch (err) {
        // --- 新增：捕获事务中的错误并回滚 ---
        console.error('[updateAppointmentStatusByuser] 事务处理过程中发生错误，尝试回滚事务。错误详情：', err);
        await transaction.rollback(); // 回滚事务
        return {
            success: false,
            message: err.message || '操作失败，请稍后重试' // 返回更具体的错误信息
        };
    }
};
