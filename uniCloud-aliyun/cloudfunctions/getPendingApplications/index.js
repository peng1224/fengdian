// cloudfunctions/getPendingApplications/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { data } = await db.collection('UserInfo')
      .where({ technicianApplicationStatus: 'pending' })
      .get();
    return { success: true, data };
  } catch (err) {
    console.error('获取待审核列表失败：', err);
    return { success: false, msg: '获取失败' };
  }
};
