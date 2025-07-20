'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { homepageId, commentId, content, userInfo } = event;

  // 1. 校验登录态
  if (!userInfo || !userInfo._id) {
    return { success: false, message: '用户未登录或 userInfo 缺失' };
  }
  const uid       = userInfo._id;
  // 多级兜底：nickname → phoneNumber → 匿名用户
  const nickname  = userInfo.nickname
                  || userInfo.phoneNumber
                  || '匿名用户';
  const avatarUrl = userInfo.avatar
                  || '/static/images/avatar-placeholder.png';

  // 2. 参数校验
  if (!homepageId || !commentId || !content || !content.trim()) {
    return { success: false, message: '缺少必要参数或内容为空' };
  }

  // 3. 构建 replyId（时间戳 + 随机后缀）
  const replyId = Date.now().toString() + Math.random().toString(36).slice(2, 8);

  // 4. 构建新回复对象
  const newReply = {
    replyId,
    userId: uid,
    userName: nickname,
    userAvatar: avatarUrl,
    content: content.trim(),
    createdAt: Date.now()
  };

  try {
    // 5. 读取并更新 Homepage 文档
    const coll = db.collection('Homepage');
    const res   = await coll.doc(homepageId).get();
    if (!res.data || res.data.length === 0) {
      return { success: false, message: '未找到技工主页' };
    }

    const doc      = res.data[0];
    const comments = Array.isArray(doc.comments) ? doc.comments : [];

    // 6. 插入到对应 comment 的 replies
    let found = false;
    const updated = comments.map(c => {
      if (c.appointmentId === commentId) {
        found = true;
        c.replies = Array.isArray(c.replies) ? c.replies.concat(newReply) : [newReply];
      }
      return c;
    });

    if (!found) {
      return { success: false, message: '找不到要回复的评论' };
    }

    // 7. 写回数据库
    await coll.doc(homepageId).update({ comments: updated });

    return { success: true, message: '回复成功' };
  } catch (err) {
    console.error('addCommentReply error:', err);
    return { success: false, message: '服务器内部错误' };
  }
};
