//getHomepageDetail
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { id } = event;
  if (!id) {
    return {
      success: false,
      message: '缺少 id 參數'
    }
  }
  // 注意：uniCloud 中返回的數據在 data 字段中是一個數組，即使是 doc().get()
  const res = await db.collection("Homepage").doc(id).get();
  
  if (res.data && res.data.length > 0) {
    return {
      success: true,
      data: res.data[0]
    }
  } else {
    return {
      success: false,
      message: '未找到對應的記錄'
    }
  }
};