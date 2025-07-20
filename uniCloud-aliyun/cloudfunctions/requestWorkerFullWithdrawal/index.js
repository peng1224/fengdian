// 云函数：requestWorkerFullWithdrawal (绕行方案)
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { userId, workerPhone } = event;

    console.log('requestWorkerFullWithdrawal 云函数开始执行 (绕行方案)。');
    console.log('接收参数：', { userId, workerPhone });

    if (!userId || !workerPhone) {
        return { success: false, message: '用户ID或工人电话缺失' };
    }

    const workerId = userId;

    // 1. 查询所有待提现的账单
    let pendingSettlements;
    try {
        const res = await db.collection('worker_settlements')
            .where({
                workerId: workerId,
                status: 'pending'
            })
            .get();
        pendingSettlements = res.data;
        if (pendingSettlements.length === 0) {
            return { success: false, message: '当前没有可提现的金额' };
        }
    } catch (err) {
        console.error('查询待提现账单失败:', err);
        return { success: false, message: '查询提现信息失败，请稍后重试' };
    }

    const totalPendingAmount = pendingSettlements.reduce((sum, item) => sum + item.amount, 0);
    if (totalPendingAmount <= 0) {
        return { success: false, message: '当前可提现金额为0' };
    }
    
    const settlementIdsToUpdate = pendingSettlements.map(item => item._id);

    // 2. 启动数据库事务
    console.log('尝试启动数据库事务...');
    const transaction = await db.startTransaction();
    console.log('数据库事务已启动。');

    try {
        // ====================【核心修改点：绕行方案】====================
        // 不再使用批量 update，而是循环单条更新，以规避底层 SDK 的 bug
        console.log(`准备在事务中逐条更新 ${settlementIdsToUpdate.length} 条记录...`);
        for (const settlement of pendingSettlements) {
            const updateRes = await transaction.collection('worker_settlements').doc(settlement._id).update({
                status: 'pending_review'
            });
            // 在事务中，如果单次更新失败，会直接抛出异常并被 catch 捕获
        }
        console.log('所有记录状态更新完成。');
        // =============================================================

        // 创建提现总请求
        const requestData = {
            workerId: workerId,
            workerPhone: workerPhone,
            amount: totalPendingAmount,
            requestAt: Date.now(),
            status: 'pending_review',
            relatedSettlementIds: settlementIdsToUpdate
        };
        const addRequestRes = await transaction.collection('withdrawal_requests').add(requestData);
        if (!addRequestRes.id) {
            throw new Error('创建提现请求记录失败'); // 在事务中，主动抛出错误以便回滚
        }
        
        // 提交事务
        await transaction.commit();
        console.log('事务提交成功。');

        return { success: true, message: '提现申请已提交，请等待平台审核' };

    } catch (err) {
        console.error('事务处理过程中发生错误，已回滚事务。错误详情：', err);
        await transaction.rollback();
        return { success: false, message: '提现申请失败，请稍后重试' };
    }
};