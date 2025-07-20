'use strict';

const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
// const { WX_APPID, WX_MCHID, WX_V3_KEY, WX_SERIAL_NO, CERT_PATHS } = require('../common/config'); // 移除此行

// 直接将 config.js 的内容嵌入到这里，不再从外部文件 require
// Start of embedded config.js content
const WX_APPID = 'wxe720228a95e1525e';
const WX_SECRET = '3f9c918c766c173c531fff8d1b45cec5'; // 此云函数可能用不到，但为了完整性保留
const WX_MCHID = '1720374769';
const WX_SERIAL_NO = '7166B152461EBE6A71EAAFB27D10A26D72792CA7';
const WX_V3_KEY = '02Zxcvbnm12Asdfghjkl24Qwertyuiop';
const CERT_PATHS = {
  cert: 'certs/apiclient_cert.pem', // 注意：这里路径是相对于云函数根目录的相对路径
  key: 'certs/apiclient_key.pem',   // 同样
  platformCert: 'certs/platform_cert.pem' // 同样
};
const NOTIFY_URL = 'https://your.domain.com/payNotify'; // 如果需要退款回调通知，请确保这个是您实际的支付回调地址
// End of embedded config.js content


// 注意：此函数已改造为纯粹的支付工具，不再需要查询数据库
// const db = uniCloud.database(); // 移除此行

function generateNonceStr(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function getTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}

function createSignature(method, url, timestamp, nonceStr, body) {
    const message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;
    const privateKeyPath = require('path').resolve(__dirname, CERT_PATHS.key); // 使用嵌入的 CERT_PATHS
    console.log('[createSignature] Resolved private key path:', privateKeyPath); // 添加日志
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

function getAuthorization(token) {
    return `WECHATPAY2-SHA256-RSA2048 ${token}`;
}

exports.main = async (event, context) => {
    // 接收调用方传入的完整退款信息
    const { orderId, refundReason, totalFee, refundFee } = event;

    // 严格校验参数
    if (!orderId || !totalFee || !refundFee) {
        return { success: false, message: '缺少订单号或关键金额信息' };
    }
    if (refundFee <= 0) {
        return { success: false, message: '退款金额必须大于0' };
    }

    const refundNo = 'refund_' + Date.now();
    const refundAmount = refundFee; // 本次实际退款金额
    const totalAmount = totalFee;   // 原始订单总金额

    const nonceStr = generateNonceStr();
    const timestamp = getTimestamp();
    const bodyJson = JSON.stringify({
        out_trade_no: orderId,
        out_refund_no: refundNo,
        reason: refundReason || '预约取消，平台退款',
        // notify_url: NOTIFY_URL, // 如需退款回调，请配置，使用嵌入的 NOTIFY_URL
        amount: {
            refund: refundAmount,
            total: totalAmount,
            currency: 'CNY'
        }
    });

    const signature = createSignature(
        'POST',
        '/v3/refund/domestic/refunds',
        timestamp,
        nonceStr,
        bodyJson
    );

    const token = `mchid="${WX_MCHID}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${WX_SERIAL_NO}",signature="${signature}"`; // 使用嵌入的常量

    const options = {
        hostname: 'api.mch.weixin.qq.com',
        port: 443,
        path: '/v3/refund/domestic/refunds',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthorization(token),
            'Accept': 'application/json',
            'User-Agent': 'fengdian-platform/1.0' // 微信支付要求必须带此字段
        },
        key: fs.readFileSync(require('path').resolve(__dirname, CERT_PATHS.key)), // 使用嵌入的 CERT_PATHS
        cert: fs.readFileSync(require('path').resolve(__dirname, CERT_PATHS.cert)) // 使用嵌入的 CERT_PATHS
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', async () => {
                try {
                    const result = JSON.parse(data);
                    if (res.statusCode === 200 || res.statusCode === 201) {
                        // 退款成功，不再更新数据库，而是将结果返回给调用方
                        resolve({
                            success: true,
                            message: '退款申请成功',
                            result,
                            refundNo: refundNo,      // 返回退款单号，用于记录
                            refundAt: Date.now()   // 返回退款时间戳，用于记录
                        });
                    } else {
                        console.error('微信退款失败', result);
                        // 记录微信支付返回的详细错误信息
                        reject({ success: false, message: `微信退款失败: ${result.message || '未知错误'}`, result });
                    }
                } catch (err) {
                    console.error('解析退款返回出错', err);
                    reject({ success: false, message: '解析微信退款结果失败' });
                }
            });
        });

        req.on('error', (e) => {
            console.error('退款请求错误', e);
            reject({ success: false, message: '请求微信退款接口出错' });
        });

        req.write(bodyJson);
        req.end();
    });
};
