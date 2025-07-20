//loginByPhone
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { phone, code, pushClientId } = event;

  console.log('Input:', { phone, code, pushClientId });

  if (!/^1\d{10}$/.test(phone) || !/^\d{4}$/.test(code)) {
    return { code: -1, errorMsg: '手机号或验证码格式错误', debug: { phone, code } };
  }

  const now = new Date();
  const smsRes = await db.collection('SmsCodes')
    .where({ phone, code, expireAt: db.command.gt(now) })
    .orderBy('expireAt', 'desc')
    .limit(1)
    .get();

  console.log('Current server time:', now.toISOString());
  console.log('SMS query result:', smsRes.data);

  if (smsRes.data.length === 0) {
    return { code: -1, errorMsg: '验证码错误或已过期', debug: { phone, code, now: now.toISOString() } };
  }

  await db.collection('SmsCodes').doc(smsRes.data[0]._id).remove();

  const userColl = db.collection('UserInfo');
  let findUser = await userColl.where({ phoneNumber: String(phone) }).get();

  console.log('User query result:', findUser.data);

  let userInfo;

  if (findUser.data.length > 0) {
    let user = findUser.data[0];
    const updateData = {
      last_login_date: now,
      custom_data: {
        ...user.custom_data,
        push_clientid: pushClientId // 更新 push_clientid
      }
    };

    await userColl.doc(user._id).update(updateData);

    const updatedUserRes = await userColl.doc(user._id).get();
    userInfo = updatedUserRes.data[0];
  } else {
    const defaultName = `用户_${phone.slice(-4)}`;
    const defaultAvatar = '/static/images/avatar-placeholder.png';

    const newUserPayload = {
      phoneNumber: phone,
      name: defaultName, // 修改为 name
      avatar: defaultAvatar,
      register_date: now,
      last_login_date: now,
      status: 'active',
      userType: 'user',
      isTechnicianApproved: false,
      applyTechnicianTime: null,
      technicianApplicationStatus: 'notApplied',
      push_clientid: pushClientId // 新用户注册时绑定 push_clientid
    };

    const addRes = await userColl.add(newUserPayload);
    userInfo = {
      _id: addRes.id,
      ...newUserPayload
    };
  }

  return {
    code: 0,
    msg: '登录成功',
    token: 'temp_token_for_custom_login_' + Date.now(),
    tokenExpired: Date.now() + 7200 * 1000,
    userInfo: userInfo
  };
};