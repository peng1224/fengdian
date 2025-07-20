//createOrUpdateChatSession
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { userAPhone, userBPhone } = event;

  // 1. 参数校验
  if (!userAPhone || !userBPhone) {
    return { success: false, message: '缺少用户手机号参数' };
  }

  // 为了保证查询的唯一性，对两个手机号进行排序
  const users = [userAPhone, userBPhone].sort();

  try {
    const col = db.collection('ChatSession');
    let sessionId;

    // 2. 查找是否已存在会话
    const queryRes = await col
      .where({
        users: dbCmd.eq(users)
      })
      .limit(1)
      .get();

    if (queryRes.data.length > 0) {
      // 2.1 已存在会话，获取 sessionId
      sessionId = queryRes.data[0]._id;
    } else {
      // 2.2 不存在会话，创建新会话
      const addRes = await col.add({
        users: users,
        lastMessage: '我们已经成为好友，开始聊天吧！',
        lastTime: Date.now(),
        unreadCount: {}, // 空对象，不设置初始未读数
        createdAt: new Date()
      });
      sessionId = addRes.id;
    }

    return { success: true, sessionId };
  } catch (err) {
    console.error('createOrUpdateChatSession 错误', err);
    return { success: false, message: '数据库操作失败', error: err };
  }
};