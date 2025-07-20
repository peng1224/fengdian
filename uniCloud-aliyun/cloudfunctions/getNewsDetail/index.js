// 云函数 getNewsDetail
'use strict';
const db = uniCloud.database();

exports.main = async (event) => {
  const { id } = event;
  
  try {
    const collection = db.collection('NewsData');
    const result = await collection.doc(id).get();
    
    if (!result.data || result.data.length === 0) {
      return { code: 404, message: '新闻不存在' };
    }
    
    return { code: 0, data: result.data[0] };
  } catch (e) {
    console.error('查询失败:', e);
    return { code: 500, message: '服务器错误' };
  }
};