// 云函数：getAdminWithdrawalRequests
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    try {
        // 1. 查询所有待审核的提现申请
        const requestsRes = await db.collection('withdrawal_requests')
            .where({
                status: 'pending_review' // 只查询待审核的提现申请
            })
            .orderBy('requestAt', 'asc') // 按申请时间正序排列，先申请的先处理
            .get();

        let requests = requestsRes.data;

        if (requests.length === 0) {
            return { success: true, data: [] }; // 没有待审核的，直接返回空数组
        }

        // 2. 提取所有workerId，去重
        const workerIds = [...new Set(requests.map(req => req.workerId))];

        // 3. 批量查询关联的工人信息 (包括微信收款信息)
        // 假设工人信息存储在 UserInfo 表，并且字段名为 name 和 phoneNumber
        const usersRes = await db.collection('UserInfo') // <-- 确保这里是您的用户集合名，例如 'UserInfo'
            .where({
                _id: db.command.in(workerIds)
            })
            .field({
                _id: true,
                name: true,         // <-- 修正：从 'nickname' 改为 'name'
                phoneNumber: true,  // <-- 修正：从 'mobile' 改为 'phoneNumber'
                'technicianInfo.weChatId': true,        // 从 technicianInfo 中获取微信号
                'technicianInfo.weChatQrCodeUrl': true  // 从 technicianInfo 中获取收款码URL
            })
            .get();
        
        const userMap = new Map();
        usersRes.data.forEach(user => {
            userMap.set(user._id, user);
        });

        // 4. 将工人信息合并到提现请求中
        requests = requests.map(req => {
            const workerInfo = userMap.get(req.workerId) || {};
            const technicianInfo = workerInfo.technicianInfo || {}; // 获取嵌套的 technicianInfo 对象

            return {
                ...req,
                workerName: workerInfo.name || '未知', // <-- 修正：使用 workerInfo.name
                workerPhone: workerInfo.phoneNumber || req.workerPhone, // <-- 修正：使用 workerInfo.phoneNumber
                weChatId: technicianInfo.weChatId || '未设置', // 从 technicianInfo.weChatId 获取
                weChatQrCodeUrl: technicianInfo.weChatQrCodeUrl || '' // 从 technicianInfo.weChatQrCodeUrl 获取
            };
        });

        return { success: true, data: requests };

    } catch (err) {
        console.error('getAdminWithdrawalRequests 云函数执行失败:', err);
        return { success: false, message: '获取待审核提现申请失败，请稍后重试' };
    }
};
