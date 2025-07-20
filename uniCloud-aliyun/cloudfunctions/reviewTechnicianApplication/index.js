// cloudfunctions/reviewTechnicianApplication/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { uid, action, reason } = event;
  if (!uid || !['approve','reject'].includes(action)) {
    return { success: false, msg: '参数错误' };
  }

  try {
    const userColl = db.collection('UserInfo');
    // get().data 是数组，获取到的是一个包含一个文档的数组
    const userRes = await userColl.doc(uid).get();
    const users = userRes.data; // 这里的 users 是一个数组

    if (!Array.isArray(users) || users.length === 0) {
      return { success: false, msg: '用户不存在' };
    }
    const user = users[0]; // 获取到实际的用户文档

    if (user.technicianApplicationStatus !== 'pending') {
      return { success: false, msg: '没有待审核申请或状态已变更' }; // 增加提示
    }

    // 构建更新内容
    const updateData = {
      technicianApplicationStatus: action === 'approve' ? 'approved' : 'rejected',
      reviewTime: new Date(),
      reviewReason: reason || ''
    };

    if (action === 'approve') {
      updateData.isTechnicianApproved = true;
      // 【修改点1】：通过审核时，将 userType 修改为 'worker'
      updateData.userType = 'worker'; 
    } else if (action === 'reject') { 
      // 【修改点2】：拒绝审核时，明确设置 isTechnicianApproved 为 false
      updateData.isTechnicianApproved = false;
    }

    // 执行更新
    await userColl.doc(uid).update(updateData);
    return { success: true, msg: '审核完成' };

  } catch (err) {
    console.error('审核失败：', err);
    return { success: false, msg: '审核异常' };
  }
};