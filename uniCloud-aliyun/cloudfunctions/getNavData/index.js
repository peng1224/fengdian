'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const res = await db.collection("NavData").orderBy("serial_number", "asc").get();
    return {
      code: 0,
      data: res.data,
      msg: "查询成功"
    };
  } catch (err) {
    return {
      code: -1,
      msg: "查询失败：" + err.message
    };
  }
};
