const axios = require('axios');

exports.main = async (event, context) => {
  const { latitude, longitude, key } = event;

  try {
    // 腾讯地图逆地理编码 API URL
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`;

    // 发送请求
    const response = await axios.get(url);

    // 返回地址信息
    return {
      success: true,
      result: response.data.result,
    };
  } catch (error) {
    console.error('逆地理编码失败:', error);
    return {
      success: false,
      message: '逆地理编码失败',
    };
  }
};