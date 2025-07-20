'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId } = event;
  if (!userId) {
    return { code: -1, errorMsg: '缺少 userId' };
  }

  try {
    const userRes = await db.collection('UserInfo')
      .doc(userId)
      .get();
    if (userRes.data.length === 0) {
      return { code: -1, errorMsg: '用户不存在' };
    }
    // 只返回必要字段，避免过多数据
    const user = userRes.data[0];
    return {
      code: 0,
      userInfo: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        avatar: user.avatar,
        userType: user.userType,
        technicianApplicationStatus: user.technicianApplicationStatus,
        // 其他 profile 渲染需要的字段...
      }
    };
  } catch (err) {
    console.error('getUserInfo 错误:', err);
    return { code: -1, errorMsg: '获取用户信息失败' };
  }
};
