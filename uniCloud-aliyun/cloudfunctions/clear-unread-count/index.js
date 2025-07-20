// clear-unread-count.js
'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { sessionId, userPhoneNumber } = event;
  if (!sessionId || !userPhoneNumber) {
    return { success: false, message: '缺少参数' };
  }
  try {
    await db.collection('ChatSession').doc(sessionId).update({
      [`unreadCount.${userPhoneNumber}`]: 0
    });
    return { success: true };
  } catch (error) {
    console.error('清除未读数失败', error);
    return { success: false, message: '清除未读数失败' };
  }
};