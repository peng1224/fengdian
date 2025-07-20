// cloudfunctions/getHomepage/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event) => {
  const { phoneNumber } = event;

  if (!phoneNumber) {
    return { success: true, data: {} };
  }

  try {
    const res = await db.collection('Homepage').where({ phoneNumber }).get();
    const record = (res.data && res.data.length) ? res.data[0] : {};
    return {
      success: true,
      data: record
    };
  } catch (err) {
    console.error('getHomepage 异常：', err);
    return {
      success: false,
      error: err.message || '获取失败'
    };
  }
};