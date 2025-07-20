//submitReview
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { appointmentId, workerPhone, reviewData } = event;

  // 基础参数校验
  if (!appointmentId || !workerPhone || !reviewData) {
    return {
      success: false,
      message: '缺少必要参数',
    };
  }

  try {
    // 查询预约记录以获取 userId
    const appointmentRecordResult = await db.collection('appointments').doc(appointmentId).get();
    if (!appointmentRecordResult.data || appointmentRecordResult.data.length === 0) {
      return {
        success: false,
        message: '无效的预约记录'
      };
    }

    const appointmentRecord = appointmentRecordResult.data[0];
    const userId = appointmentRecord.userId;

    if (!userId) {
      return {
        success: false,
        message: '无法关联用户信息'
      };
    }

    // 检查是否已评价
    if (appointmentRecord.review) {
      return {
        success: false,
        message: '您已经评价过此订单'
      };
    }

    // 构造评价对象，新增 name 和 avatar 字段
    const newComment = {
      userId: userId,
      appointmentId: appointmentId,
      rating: reviewData.rating || 0,
      comment: reviewData.comment || '',
      images: reviewData.images || [],
      name: reviewData.name || '匿名用户', // 如果未提供 name，则显示“匿名用户”
      avatar: reviewData.avatar || '/static/images/avatar-placeholder.png', // 如果未提供 avatar，则使用默认头像
      createdAt: Date.now(),
      replies: []
    };

    // 更新 appointments 集合
    await db.collection('appointments').doc(appointmentId).update({
      review: newComment
    });

    // 更新 Homepage 集合
    await db.collection('Homepage').where({
      phoneNumber: workerPhone
    }).update({
      comments: dbCmd.unshift(newComment)
    });

    return {
      success: true,
      message: '评价成功',
    };
  } catch (err) {
    console.error('提交评价失败', err);
    return {
      success: false,
      message: '数据库操作失败，请稍后重试',
      error: err,
    };
  }
};