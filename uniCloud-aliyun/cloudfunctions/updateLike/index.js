'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { id, phoneNumber } = event; // 關鍵改動：接收 phoneNumber
  if (!id || !phoneNumber) {
    return { success: false, message: '缺少必要參數' };
  }

  const today = new Date().toDateString();
  
  try {
    const docRef = db.collection('Homepage').doc(id);
    const doc = await docRef.get();
    
    if (!doc.data || doc.data.length === 0) {
      return { success: false, message: '文檔不存在' };
    }

    let { likedBy = [], likeCount = 0 } = doc.data[0];

    // 關鍵改動：基於 phoneNumber 查找點讚記錄
    const userLikeIndex = likedBy.findIndex(
      item => item.phoneNumber === phoneNumber && new Date(item.likeTime).toDateString() === today
    );

    if (userLikeIndex !== -1) {
      // 如果今天已點讚，則取消點讚
      likedBy.splice(userLikeIndex, 1);
      likeCount = Math.max(0, likeCount - 1);
      await docRef.update({ likeCount, likedBy });
      return { success: true, message: '已取消點讚' };
    } else {
      // 如果今天未點讚，則執行點讚
      likedBy.push({ phoneNumber, likeTime: Date.now() });
      likeCount += 1;
      await docRef.update({ likeCount, likedBy });
      return { success: true, message: '點讚成功' };
    }
  } catch (error) {
    console.error('雲函數 update-like 報錯：', error);
    return { success: false, message: '服務器內部錯誤' };
  }
};