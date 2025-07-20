// 云函数 upNewsview_count
'use strict';
const db = uniCloud.database();

exports.main = async (event) => {
  const { id } = event;
  
  try {
    // 阿里云数据库操作
    const collection = db.collection('NewsData');
    const result = await collection.doc(id).update({
      view_count: db.command.inc(7)
    });
    
    if (result.updated === 0) {
      console.warn(`未找到文档: ${id}`);
      return { code: 404, message: '文档不存在' };
    }
    
    return { code: 0, data: result };
  } catch (e) {
    console.error('更新失败:', e);
    return { code: 500, message: '服务器错误' };
  }
};