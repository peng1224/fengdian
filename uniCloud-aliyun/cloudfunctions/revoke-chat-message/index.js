// revoke-chat-message.js
'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { messageId } = event;
  if (!messageId) {
    return { success: false, message: '缺少消息ID' };
  }
  try {
    const res = await db.collection('ChatMessages').doc(messageId).update({
      isRevoked: true
    });
    if (res.updated > 0) {
      return { success: true };
    } else {
      return { success: false, message: '消息不存在或已撤回' };
    }
  } catch (error) {
    console.error('撤回消息失败', error);
    return { success: false, message: '撤回消息失败' };
  }
};