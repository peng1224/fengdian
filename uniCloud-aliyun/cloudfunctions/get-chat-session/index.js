'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { sessionId } = event;
  
  if (!sessionId) {
    return { success: false, message: '缺少sessionId参数' };
  }
  
  try {
    const res = await db.collection('ChatSession').doc(sessionId).get();
    
    if (res.data && res.data.length > 0) {
      return {
        success: true,
        data: res.data[0]
      };
    }
    
    return {
      success: false,
      message: '会话不存在',
      data: null
    };
  } catch (e) {
    console.error('获取会话信息失败:', e);
    return {
      success: false,
      message: '获取会话信息失败: ' + e.message
    };
  }
};