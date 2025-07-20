// 云函数：getWorkerAvailableBalance
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
    const { userId } = event;

    if (!userId) {
        return { success: false, message: '用户ID缺失' };
    }

    try {
        const workerId = userId; 

        // 1. 计算可提现余额 (status: 'pending')
        const availableResult = await db.collection('worker_settlements').aggregate()
            .match({
                workerId: workerId,
                status: 'pending' // 只计算待提现的收入
            })
            .group({
                _id: null,
                totalAmount: dbCmd.aggregate.sum('$amount')
            })
            .end();

        let availableBalance = 0;
        if (availableResult.data && availableResult.data.length > 0) {
            availableBalance = availableResult.data[0].totalAmount;
        }

        // 2. 计算提现审核中的金额 (status: 'pending_review')
        const pendingReviewResult = await db.collection('worker_settlements').aggregate()
            .match({
                workerId: workerId,
                status: 'pending_review' // 计算提现审核中的金额
            })
            .group({
                _id: null,
                totalAmount: dbCmd.aggregate.sum('$amount')
            })
            .end();

        let pendingWithdrawalAmount = 0;
        if (pendingReviewResult.data && pendingReviewResult.data.length > 0) {
            pendingWithdrawalAmount = pendingReviewResult.data[0].totalAmount;
        }
        
        // 将以“分”为单位的总金额转换为以“元”为单位
        return { 
            success: true, 
            availableBalance: availableBalance / 100, // 转换为元
            pendingWithdrawalAmount: pendingWithdrawalAmount / 100 // 转换为元
        };

    } catch (err) {
        console.error('getWorkerAvailableBalance 云函数执行失败:', err);
        return { success: false, message: '获取金额失败，请稍后重试' };
    }
};
