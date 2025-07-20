// get-chat-list.js
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { userPhoneNumber } = event;
  if (!userPhoneNumber) {
    return { success: false, message: '缺少用户标识' };
  }

  try {
    // 1. 查询当前用户参与的所有会话，按最后通信时间降序排列
    const sessionsRes = await db
      .collection('ChatSession')
      .where({
        users: userPhoneNumber
      })
      .orderBy('lastTime', 'desc')
      .get();

    const sessions = sessionsRes.data;
    if (sessions.length === 0) {
      return { success: true, data: [] };
    }

    // 2. 提取所有对话方的手机号
    const otherUserPhones = sessions.map((s) => {
      return s.users.find((phone) => phone !== userPhoneNumber);
    });

    // 3. 从 UserInfo 集合批量查询对方的最新信息
    const usersRes = await db
      .collection('UserInfo')
      .where({
        phoneNumber: dbCmd.in(otherUserPhones)
      })
      .field({ name: 1, avatar: 1, phoneNumber: 1 }) // 修改为 name
      .get();

    // 4. 将用户信息转为 Map，便于查找
    const userInfoMap = new Map();
    usersRes.data.forEach((user) => {
      userInfoMap.set(user.phoneNumber, user);
    });

    // 5. 聚合数据，生成聊天列表
    const chatList = sessions.map((sess) => {
      const otherPhone = sess.users.find((p) => p !== userPhoneNumber);
      const otherUserInfo = userInfoMap.get(otherPhone) || {};

      return {
        sessionId: sess._id,
        unreadCount: sess.unreadCount[userPhoneNumber] || 0,
        lastMessage: sess.lastMessage || '',
        lastTime: sess.lastTime,
        name: otherUserInfo.name || '未知用户', // 修改为 name
        avatar: otherUserInfo.avatar || '',
        otherUserPhone: otherPhone
      };
    });

    return { success: true, data: chatList };
  } catch (error) {
    console.error('get-chat-list 执行失败:', error);
    return { success: false, message: '服务器内部错误' };
  }
};