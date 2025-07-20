// 文件: uniCloud/cloudfunctions/send-chat-message/index.js
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { sessionId, message } = event;
  const senderId = message && message.sender;

  if (!sessionId || !message || !senderId) {
    console.log('执行失败，收到的参数:', { sessionId, message });
    return { success: false, message: '缺少会话ID、消息体或发送者信息' };
  }

  // 获取会话信息
  let sessionDoc;
  try {
    const sessionRes = await db.collection('ChatSession').doc(sessionId).get();
    if (!sessionRes.data || sessionRes.data.length === 0) {
      return { success: false, message: '会话不存在' };
    }
    sessionDoc = sessionRes.data[0];
  } catch (e) {
    console.error('获取会话失败', e);
    return { success: false, message: '获取会话失败' };
  }
  
  // 准备消息数据
  const messageData = {
    ...message,
    sessionId: sessionId,
    timestamp: Date.now(),
    isRevoked: false,
    participants: sessionDoc.users
  };

  try {
    // 添加消息到数据库
    const addRes = await db.collection('ChatMessages').add(messageData);

    // 更新会话信息
    const recipientPhone = sessionDoc.users.find(phone => phone !== senderId);
    if (recipientPhone) {
      await db.collection('ChatSession').doc(sessionId).update({
        lastMessage: message.type === 'text' ? message.message : `[${message.type}]`,
        lastTime: messageData.timestamp,
        [`unreadCount.${recipientPhone}`]: dbCmd.inc(1)
      });
    }

    return { success: true, messageId: addRes.id };
  } catch (error) {
    console.error('发送消息失败', error);
    return { success: false, message: '数据库操作失败' };
  }
};