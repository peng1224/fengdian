// Directory: cloudfunctions/createPayOrder/index.js
// Purpose: Unified order and return payment params
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

// 直接将 config.js 的内容嵌入到这里，不再从外部文件 require
// Start of embedded config.js content
const WX_APPID = 'wxe720228a95e1525e';
const WX_SECRET = '3f9c918c766c173c531fff8d1b45cec5'; // 这个在这个云函数中可能用不到，但为了完整性保留
const WX_MCHID = '1720374769';
const WX_SERIAL_NO = '7166B152461EBE6A71EAAFB27D10A26D72792CA7';
const WX_V3_KEY = '02Zxcvbnm12Asdfghjkl24Qwertyuiop';
const CERT_PATHS = {
  cert: 'certs/apiclient_cert.pem', // 注意：这里路径是相对于云函数根目录的相对路径
  key: 'certs/apiclient_key.pem',   // 同样
  platformCert: 'certs/platform_cert.pem' // 同样
};
const NOTIFY_URL = 'https://your.domain.com/payNotify'; // 请确保这个是您实际的支付回调地址
// End of embedded config.js content


// 主函数入口
exports.main = async (event, context) => {
  const { openid, total_fee, body } = event;

  // 确保传入的 out_trade_no 不为空
  const out_trade_no = event.out_trade_no || generateOutTradeNo();

  console.log('生成的商户订单号 out_trade_no:', out_trade_no);

  // 加载私钥
  const privateKey = fs.readFileSync(
    path.resolve(__dirname, CERT_PATHS.key), // 使用嵌入的 CERT_PATHS
    'utf8'
  );

  const mchid = WX_MCHID; // 使用嵌入的常量
  const appid = WX_APPID; // 使用嵌入的常量
  const notify_url = NOTIFY_URL; // 使用嵌入的常量

  // 构建微信支付请求体
  const reqData = {
    appid,
    mchid,
    description: body || '微信支付',
    out_trade_no,  // 确保此字段有值
    notify_url,
    amount: {
      total: total_fee, // 单位：分（如100 表示1元）
      currency: 'CNY'
    },
    payer: {
      openid
    }
  };

  // 准备签名相关参数
  const method = 'POST';
  const urlPath = '/v3/pay/transactions/jsapi';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomBytes(16).toString('hex');
  const bodyStr = JSON.stringify(reqData);

  const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${bodyStr}\n`;
  const sign = crypto.createSign('RSA-SHA256').update(message).sign(privateKey, 'base64');

  const serial_no = getCertSerialNo(); // getCertSerialNo 函数内部也会使用 CERT_PATHS
  const token = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",signature="${sign}",timestamp="${timestamp}",serial_no="${serial_no}"`;

  // 发起 HTTPS 请求给微信
  const response = await axios.post(`https://api.mch.weixin.qq.com${urlPath}`, reqData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  }).catch(error => {
    console.error('微信支付请求出错：', {
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`微信支付接口报错：${JSON.stringify(error.response?.data)}`);
  });

  const resData = response.data;

  // 微信返回预支付 ID
  const prepayId = resData.prepay_id;
  if (!prepayId) {
    throw new Error(`无法获取 prepay_id，微信返回内容为：${JSON.stringify(resData)}`);
  }

  // 构造支付参数返回给前端
  return buildPayParams(prepayId, privateKey);
};

// 构造客户端支付参数
function buildPayParams(prepayId, privateKey) {
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomBytes(16).toString('hex');
  const pkg = `prepay_id=${prepayId}`;
  const message = `${WX_APPID}\n${timeStamp}\n${nonceStr}\n${pkg}\n`; // 使用嵌入的 WX_APPID

  const paySign = crypto.createSign('RSA-SHA256').update(message).sign(privateKey, 'base64');

  return {
    timeStamp,
    nonceStr,
    package: pkg,
    signType: 'RSA',
    paySign
  };
}

// 获取商户证书序列号（序列号为十六进制字符串）
function getCertSerialNo() {
  const certPath = path.resolve(__dirname, CERT_PATHS.cert); // 使用嵌入的 CERT_PATHS
  const certPem = fs.readFileSync(certPath, 'utf8');

  // Node.js 15+ 支持 X509Certificate
  if (crypto.X509Certificate) {
    const x509 = new crypto.X509Certificate(certPem);
    return x509.serialNumber;
  }

  // 若 Node 版本不支持 X509Certificate，可以考虑使用 openssl 工具提取
  throw new Error('当前 Node.js 不支持 X509Certificate，请升级至 v15+ 或手动提取证书序列号');
}

// 生成一个唯一的商户订单号
function generateOutTradeNo() {
  return `order_${Date.now()}`;  // 使用时间戳生成订单号，例如：order_1688062800000
}
