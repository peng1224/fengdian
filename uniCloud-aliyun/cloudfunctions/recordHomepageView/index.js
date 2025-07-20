'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { id, phoneNumber } = event; // 關鍵改動：接收 phoneNumber

  if (!id) {
    return { success: false, message: '缺少 id 參數' };
  }

  try {
    await db.collection('homepage_views').add({
      homepageId: id,
      viewerPhoneNumber: phoneNumber, // 關鍵改動：字段名修改
      viewTimestamp: Date.now(),
      viewDate: new Date()
    });
    return { success: true };
  } catch (err) {
    console.error('記錄瀏覽失敗', err);
    return { success: false, message: '記錄失敗' };
  }
}