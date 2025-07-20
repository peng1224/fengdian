// get-history-messages.js
'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { sessionId, lastTimestamp, pageSize = 15 } = event;
  if (!sessionId || !lastTimestamp) {
    return { success: false, message: '缺少参数' };
  }
  try {
    const res = await db.collection('ChatMessages')
      .where({
        sessionId: sessionId,
        timestamp: db.command.lt(lastTimestamp) // 获取早于 lastTimestamp 的消息
      })
      .orderBy('timestamp', 'desc')
      .limit(pageSize)
      .get();
    return { success: true, data: res.data.reverse() }; // 反转后为升序
  } catch (error) {
    console.error('获取历史消息失败', error);
    return { success: false, message: '获取历史消息失败' };
  }
};