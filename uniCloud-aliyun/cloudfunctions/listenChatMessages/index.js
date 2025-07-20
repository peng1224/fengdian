'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { sessionId, pageSize = 15 } = event;
  if (!sessionId) {
    return { success: false, message: '缺少会话ID参数' };
  }
  try {
    const res = await db.collection('ChatMessages')
      .where({ sessionId: sessionId })
      .orderBy('timestamp', 'desc')
      .limit(pageSize)
      .get();
    return { success: true, data: res.data.reverse() };
  } catch (error) {
    console.error('获取消息失败', error);
    return { success: false, message: '获取消息失败' };
  }
};