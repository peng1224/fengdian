//loginByUsername
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { username, password } = event

  // 1. 校验参数
  if (!username || !password) {
    return { status: 'fail', errorMsg: '用户名或密码不能为空' }
  }

  // 2. 查询用户信息
  const userRes = await db.collection('UserInfo')
    .where({ username, password })
    .limit(1)
    .get()

  if (userRes.data.length > 0) {
    const user = userRes.data[0]
    // 3. 更新最后登录时间
    await db.collection('UserInfo').doc(user._id).update({
      last_login_date: new Date()
    })
    // 4. 返回用户信息
    return { status: 'success', userInfo: user }
  } else {
    return { status: 'fail', errorMsg: '用户名或密码错误' }
  }
}