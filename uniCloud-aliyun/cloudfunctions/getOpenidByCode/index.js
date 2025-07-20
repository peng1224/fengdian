// cloudfunctions/getOpenidByCode/index.js
// 目的：用小程序登录 code 换 openid

'use strict';

// 直接将 config.js 的内容嵌入到这里，不再从外部文件 require
// Start of embedded config.js content
const WX_APPID = 'wxe720228a95e1525e';
const WX_SECRET = '3f9c918c766c173c531fff8d1b45cec5';
// 以下支付相关配置在此云函数中可能不需要，但为了完整性保留
const WX_MCHID = '1720374769';
const WX_SERIAL_NO = '7166B152461EBE6A71EAAFB27D10A26D72792CA7';
const WX_V3_KEY = '02Zxcvbnm12Asdfghjkl24Qwertyuiop';
// CERT_PATHS 和 NOTIFY_URL 通常只在需要处理支付回调的云函数中使用
// const CERT_PATHS = { /* ... */ };
// const NOTIFY_URL = 'https://your.domain.com/payNotify';
// End of embedded config.js content


exports.main = async (event, context) => {
  const { code } = event;
  // Use httpclient to request jscode2session
  const { httpclient } = uniCloud;
  
  // 直接使用嵌入的常量
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
  
  // Add logging for the request URL
  console.log('[getOpenidByCode] Requesting URL:', url);

  const response = await httpclient.request(url, { method: 'GET' });
  // Add logging for the raw response status and data from WeChat API
  console.log('[getOpenidByCode] WeChat API Response Status:', response.status);
  console.log('[getOpenidByCode] WeChat API Response Data (raw):', response.data);

  if (response.status !== 200) {
    throw new Error(`jscode2session HTTP error ${response.status}`);
  }
  const data = JSON.parse(response.data);
  // Add logging for the parsed data from WeChat API
  console.log('[getOpenidByCode] Parsed WeChat API Data:', data);

  if (data.errcode) {
    throw new Error(`jscode2session error: ${data.errmsg}`);
  }
  // Add logging for the successfully extracted openid
  console.log('[getOpenidByCode] Successfully got openid:', data.openid);
  return { openid: data.openid };
};
