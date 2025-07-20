// cloudfunctions/has-new-messages/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { sessionId, lastTimestamp = 0 } = event;
  if (!sessionId) {
    return { success: false, message: '缺少sessionId' };
  }
  try {
    const res = await db.collection('ChatMessages')
      .where({
        sessionId,
        timestamp: db.command.gt(lastTimestamp)
      })
      .limit(1)  // 只取1条
      .get();
    return {
      success: true,
      hasNew: Array.isArray(res.data) && res.data.length > 0
    };
  } catch (err) {
    console.error('has-new-messages失败', err);
    return { success: false, message: '检查失败' };
  }
};
