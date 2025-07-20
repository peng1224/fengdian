//getUserAppointments
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId } = event;

  if (!userId) {
    return {
      success: false,
      message: '缺少用户ID',
    };
  }

  try {
    const res = await db.collection('appointments')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .get();

    return {
      success: true,
      data: res.data
    };
  } catch (err) {
    console.error('数据库查询失败', err);
    return {
      success: false,
      message: '查询失败，请稍后重试',
      error: err
    };
  }
};
