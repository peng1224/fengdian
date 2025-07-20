// 云函数：autoCompleteAppt
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

// 定义常量：3小时宽限期 (毫秒)
const GRACE_PERIOD_MS = 3 * 60 * 60 * 1000; // 3小时

exports.main = async (event, context) => {
    console.log('[autoCompleteAppt] 云函数开始执行。'); // 日志名称也相应修改
    const currentTime = Date.now();
    const overdueThreshold = currentTime - GRACE_PERIOD_MS; // 预计结束时间 + 3小时宽限期 < 当前时间

    try {
        // 1. 查询所有符合条件的超时预约
        // 条件：
        // - 状态不是 'completed' 或 'cancelled'
        // - 支付状态为 'PAID' (只处理已支付的订单)
        // - 预约的预计结束时间 + 3小时宽限期 已经过去
        console.log(`[autoCompleteAppt] 查询超时预约，阈值时间: ${new Date(overdueThreshold).toISOString()}`); // 日志名称也相应修改
        const overdueAppointmentsRes = await db.collection('appointments')
            .where({
                status: dbCmd.nin(['completed', 'cancelled_by_user', 'cancelled_by_worker']), // 排除已完成和已取消的
                payStatus: 'PAID', // 必须是已支付的订单
                expectedEndTime: dbCmd.lt(overdueThreshold) // 预计结束时间 + 3小时宽限期 < 当前时间
            })
            .get();

        const overdueAppointments = overdueAppointmentsRes.data;
        console.log(`[autoCompleteAppt] 发现 ${overdueAppointments.length} 条超时预约待处理。`); // 日志名称也相应修改

        if (overdueAppointments.length === 0) {
            console.log('[autoCompleteAppt] 没有发现超时预约。'); // 日志名称也相应修改
            return { success: true, message: '没有发现超时预约' };
        }

        let successCount = 0;
        let failCount = 0;
        const failedAppointments = [];

        // 2. 遍历并处理每个超时预约
        for (const appointment of overdueAppointments) {
            console.log(`[autoCompleteAppt] 尝试自动完成预约: ${appointment._id}`); // 日志名称也相应修改
            try {
                // 调用 updateAppointmentStatusByuser 云函数来处理完成和结算逻辑
                // 这将复用我们之前编写的事务和收益结算逻辑
                const res = await uniCloud.callFunction({
                    name: 'updateAppointmentStatusByuser',
                    data: {
                        appointmentId: appointment._id,
                        status: 'completed' // 强制设置为 completed
                    }
                });

                if (res.result && res.result.success) {
                    successCount++;
                    console.log(`[autoCompleteAppt] 预约 ${appointment._id} 自动完成成功。`); // 日志名称也相应修改
                } else {
                    failCount++;
                    failedAppointments.push({
                        appointmentId: appointment._id,
                        reason: res.result ? res.result.message : '未知错误'
                    });
                    console.error(`[autoCompleteAppt] 预约 ${appointment._id} 自动完成失败: ${res.result ? res.result.message : '未知错误'}`); // 日志名称也相应修改
                }
            } catch (callErr) {
                failCount++;
                failedAppointments.push({
                    appointmentId: appointment._id,
                    reason: callErr.message || '调用 updateAppointmentStatusByuser 异常'
                });
                console.error(`[autoCompleteAppt] 调用 updateAppointmentStatusByuser 异常，预约 ${appointment._id}:`, callErr); // 日志名称也相应修改
            }
        }

        console.log(`[autoCompleteAppt] 自动完成任务结束。成功: ${successCount}，失败: ${failCount}。`); // 日志名称也相应修改
        return {
            success: true,
            message: `自动完成任务完成。成功处理 ${successCount} 条，失败 ${failCount} 条。`,
            failedAppointments: failedAppointments
        };

    } catch (err) {
        console.error('[autoCompleteAppt] 云函数执行异常:', err); // 日志名称也相应修改
        return { success: false, message: '自动完成预约任务执行异常', error: err.message };
    }
};
