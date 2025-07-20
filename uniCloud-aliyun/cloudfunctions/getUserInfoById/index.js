// 云函数：getUserInfoById
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { userId } = event;

    if (!userId) {
        return { success: false, message: '用户ID缺失' };
    }

    try {
        const userRes = await db.collection('UserInfo').doc(userId).get();

        if (userRes.data && userRes.data.length > 0) {
            return { success: true, data: userRes.data[0] };
        } else {
            return { success: false, message: '未找到用户数据' };
        }
    } catch (err) {
        console.error('getUserInfoById 云函数执行失败:', err);
        return { success: false, message: '获取用户数据失败，请稍后重试' };
    }
};
