// cloudfunctions/getAllHomepageForpreviewList/index.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const res = await db.collection('Homepage').get(); // 获取所有字段
    return {
      code: 0,
      data: res.data || [],
      message: '获取成功'
    };
  } catch (err) {
    console.error('获取Homepage数据失败:', err);
    return {
      code: 1,
      data: [],
      message: '获取失败',
      error: err.message
    };
  }
};