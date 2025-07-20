// Directory: cloudfunctions/payNotify/index.js
// Purpose: Handle WeChat Pay async notifications
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../common/config');

exports.main = async (event, context) => {
  const headers = event.headers;
  const body = event.body;

  const xml2js = require('xml2js');
  const parsed = await xml2js.parseStringPromise(body, { explicitArray: false });
  const notif = parsed.xml;

  const timestamp = headers['wechatpay-timestamp'];
  const nonce = headers['wechatpay-nonce'];
  const signature = headers['wechatpay-signature'];
  const payload = ${timestamp}\n${nonce}\n${body}\n;

  const platformCert = fs.readFileSync(config.CERT_PATHS.platformCert);
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(payload);

  if (!verifier.verify(platformCert, signature, 'base64')) {
    return '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[invalid signature]]></return_msg></xml>';
  }

  if (notif.result_code === 'SUCCESS') {
    const out_trade_no = notif.out_trade_no;
    const db = uniCloud.database();
    await db.collection('appointments').where({ orderId: out_trade_no })
      .update({ payStatus: 'PAID', transactionId: notif.transaction_id });

    return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
  }

  return '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[invalid result]]></return_msg></xml>';
};