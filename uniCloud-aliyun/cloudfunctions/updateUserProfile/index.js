'use strict';

const db = uniCloud.database();
const cloud = uniCloud.cloud; // 引入 cloud 对象，用于文件删除

exports.main = async (event, context) => {
  const { phoneNumber, name, avatar, oldAvatarFileID, isWorker, weChatId, weChatQrCodeUrl, oldWeChatQrCodeUrl } = event;

  // 参数校验
  if (!phoneNumber) {
    return { code: 400, msg: '缺少 phoneNumber', success: false };
  }
  if (!name || !name.trim()) {
    return { code: 400, msg: '姓名不能为空', success: false };
  }

  try {
    const userColl = db.collection('UserInfo');
    // 查询用户
    const queryRes = await userColl.where({ phoneNumber }).get();
    if (!queryRes.data || queryRes.data.length === 0) {
      return { code: 404, msg: '未找到对应用户', success: false };
    }

    const docId = queryRes.data[0]._id;
    const currentUserInfo = queryRes.data[0]; // 获取当前用户完整信息

    // 构造更新数据
    const updateData = {
      name: name.trim(),
      last_update: new Date()
    };

    // --- 优化头像更新逻辑 ---
    let newAvatarValue = currentUserInfo.avatar; // 默认保持数据库中当前的头像

    // 如果前端传了新的头像文件ID (表示用户上传了新头像)
    if (avatar && avatar.trim()) {
      newAvatarValue = avatar.trim();
      // 如果旧头像存在且是云端文件，并且与新头像不同，则删除旧头像
      if (oldAvatarFileID && oldAvatarFileID.startsWith('cloud://') && newAvatarValue !== oldAvatarFileID) {
        await uniCloud.deleteFile({ fileList: [oldAvatarFileID] });
        console.log(`旧头像 ${oldAvatarFileID} 已删除`);
      }
    } 
    // 如果前端传了空字符串 (表示用户清空了头像)
    else if (avatar === '') {
      // 只有当旧头像是一个云端文件时才清空（即用户删除了自定义头像）
      // 如果旧头像不是云端文件（例如是默认的静态路径），则不执行清空操作，保持原样
      if (oldAvatarFileID && oldAvatarFileID.startsWith('cloud://')) {
        newAvatarValue = ''; // 清空头像
        await uniCloud.deleteFile({ fileList: [oldAvatarFileID] });
        console.log(`旧头像 ${oldAvatarFileID} 已删除`);
      }
      // 如果 oldAvatarFileID 是默认头像路径 (如 /static/images/default-avatar.png)，
      // 且前端没有上传新头像，newAvatarValue 保持为 currentUserInfo.avatar (即默认头像路径)，不进行更新。
    }
    // 如果 avatar 为 undefined (前端没有传这个字段，表示没有对头像进行任何操作)，
    // newAvatarValue 保持为 currentUserInfo.avatar，不进行更新。

    updateData.avatar = newAvatarValue; // 将最终确定的头像值赋给 updateData


    // 如果是工人，处理技工信息更新
    if (isWorker) {
      const technicianInfoUpdate = {};

      // 更新微信号
      technicianInfoUpdate.weChatId = weChatId || '';

      // 更新微信收款码
      if (weChatQrCodeUrl && weChatQrCodeUrl.trim()) { // 如果前端传了新收款码
        technicianInfoUpdate.weChatQrCodeUrl = weChatQrCodeUrl.trim();
      } else if (weChatQrCodeUrl === '') { // 如果前端明确传空，表示删除收款码
        technicianInfoUpdate.weChatQrCodeUrl = '';
      }
      // 注意：如果 weChatQrCodeUrl 为 undefined，则不更新该字段

      // 处理旧收款码删除
      if (oldWeChatQrCodeUrl && technicianInfoUpdate.weChatQrCodeUrl !== oldWeChatQrCodeUrl) {
        // 只有当旧收款码存在且新收款码与旧收款码不同时才删除旧收款码
        await uniCloud.deleteFile({
          fileList: [oldWeChatQrCodeUrl]
        });
        console.log(`旧收款码 ${oldWeChatQrCodeUrl} 已删除`);
      }

      // 将技工信息更新合并到主更新数据中
      updateData.technicianInfo = {
        ...currentUserInfo.technicianInfo, // 保留现有 technicianInfo 的其他字段
        ...technicianInfoUpdate
      };
    }

    // 更新用户文档
    await userColl.doc(docId).update(updateData);

    // 重新查询最新用户信息，返回给前端
    const freshRes = await userColl.doc(docId).get();
    return {
      code: 200,
      msg: '更新成功',
      success: true,
      data: freshRes.data[0]
    };

  } catch (err) {
    console.error('【updateUserProfile】更新异常：', err);
    return {
      code: 500,
      msg: '服务器内部错误',
      success: false,
      error: err.message || err
    };
  }
};
