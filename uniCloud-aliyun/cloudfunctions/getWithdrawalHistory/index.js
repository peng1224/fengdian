// 云函数：getWithdrawalHistory
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { userId } = event; // 这里的 userId 对应前端 userinfo._id

    if (!userId) {
        return { success: false, message: '用户ID缺失' };
    }

    const workerId = userId; // 假设 workerId 和 userId 是同一个ID

    try {
        const historyRes = await db.collection('withdrawal_requests')
            .where({
                workerId: workerId
            })
            .orderBy('requestAt', 'desc') // 按申请时间倒序排列
            .get();

        return { success: true, data: historyRes.data };

    } catch (err) {
        console.error('getWithdrawalHistory 云函数执行失败:', err);
        return { success: false, message: '获取提现历史失败，请稍后重试' };
    }
};
