'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
    const { applicationData, uid } = event; // 直接从前端获取用户ID和所有申请数据

    // 1. 校验必填字段
    if (!applicationData || !applicationData.realName || !applicationData.idCard) {
        return { success: false, message: '真实姓名和身份证号不能为空' };
    }
    // 新增：校验微信收款码URL
    if (!applicationData.weChatQrCodeUrl) {
        return { success: false, message: '微信收款码为必填项' };
    }

    // 2. 直接更新用户数据
    try {
        const result = await db.collection('UserInfo').doc(uid).update({
            "technicianInfo.realName": applicationData.realName,
            "technicianInfo.idCard": applicationData.idCard,
            "technicianInfo.skills": applicationData.skills || '',
            "technicianInfo.certificates": applicationData.certificates || [],
            // 新增：将微信收款信息存储到 technicianInfo 字段下
            "technicianInfo.weChatId": applicationData.weChatId || '', 
            "technicianInfo.weChatQrCodeUrl": applicationData.weChatQrCodeUrl || '',
            
            technicianApplicationStatus: 'pending', // 申请状态设为待审核
            applyTechnicianTime: new Date() // 记录申请时间
        });
        
        if (result.updated === 1) {
            return { success: true, message: '申请提交成功' };
        } else {
            // 如果 updated 为 0，可能是用户ID不存在或数据未发生变化
            return { success: false, message: '用户不存在或更新失败' };
        }
    } catch (err) {
        console.error('数据库更新失败：', err);
        return { success: false, message: '服务器错误，请稍后再试' };
    }
};
