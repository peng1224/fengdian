// uniCloud/cloudfunctions/get-total-unread-count/index.js
'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  const { userPhoneNumber } = event;
  if (!userPhoneNumber) {
    return { success: false, msg: '缺少用户标识' };
  }

  // 动态字段路径当普通字符串
  const unreadField = `$unreadCount.${userPhoneNumber}`;

  try {
    const result = await db.collection('ChatSession')
      .aggregate()
      // 1. 只筛选当前用户参与的会话
      .match({ users: userPhoneNumber })
      // 2. project 出每条文档对应用户的 unread 值
      .project({ unread: unreadField })
      // 3. group 累加所有 unread
      .group({
        _id: null,
        totalUnread: $.sum('$unread')
      })
      .end();

    const totalUnread = (result.data[0] && result.data[0].totalUnread) || 0;
    return { success: true, totalUnread };

  } catch (err) {
    console.error('get-total-unread-count 执行失败：', err);
    return { success: false, msg: '服务器内部错误' };
  }
};
