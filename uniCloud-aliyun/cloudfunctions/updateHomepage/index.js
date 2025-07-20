// cloudfunctions/updateHomepage/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event) => {
  const { action, data, field, value, phoneNumber } = event;
  if (!phoneNumber) {
    return { success: false, error: 'phoneNumber 参数缺失' };
  }

  try {
    const coll = db.collection('Homepage');
    const queryRes = await coll.where({ phoneNumber }).get();

    if (!queryRes.data || queryRes.data.length === 0) {
      console.log('🆕 创建新文档');
      const baseData = {
        phoneNumber,
        createTime: new Date(),
        ...data // 直接平铺 data 中的字段
      };
      await coll.add(baseData);
      console.log('✅ 文档创建成功');
      return { success: true, message: '文档创建成功' };
    }

    const docId = queryRes.data[0]._id;
    console.log('🔄 更新文档:', docId);

    if (action === 'update') {
      await coll.doc(docId).update(data); // 直接更新 data 中的字段
      console.log('✅ 数据更新成功');
      return { success: true, message: '数据更新成功' };
    } else if (action === 'updateField') {
      await coll.doc(docId).update({ [field]: value });
      console.log('✅ 字段更新成功');
      return { success: true, message: '字段更新成功' };
    } else {
      console.error('❌ 无效操作类型：', action);
      return { success: false, error: '无效操作类型' };
    }
  } catch (err) {
    console.error('🔥 云函数异常:', err);
    return { success: false, error: err.message || '服务端错误', detail: err };
  }
};