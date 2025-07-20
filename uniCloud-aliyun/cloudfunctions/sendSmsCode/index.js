// //sendSmsCode
// 'use strict';
// const db = uniCloud.database();

// /**
//  * 生成4位数字验证码
//  */
// function generateCode() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// exports.main = async (event, context) => {
//   const { phone } = event;
//   console.log('[sendSmsCode] 收到请求，参数:', { phone });

//   // 1. 验证手机号格式
//   if (!/^1\d{10}$/.test(phone)) {
//     console.warn('[sendSmsCode] 手机号格式不正确:', phone);
//     return { success: false, code: -1, errorMsg: '请输入有效的手机号' };
//   }

//   const code = generateCode();
//   const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期
//   console.log(`[sendSmsCode] 为手机号 ${phone} 生成验证码: ${code}, 过期时间: ${expireAt.toISOString()}`);

//   // 2. 将验证码存入数据库
//   try {
//     await db.collection('SmsCodes').add({
//       phone,
//       code,
//       expireAt,
//       createdAt: new Date() // 建议增加创建时间
//     });
//     console.log(`[sendSmsCode] 验证码 ${code} 已成功存入数据库`);
//   } catch (e) {
//     console.error('[sendSmsCode] 数据库写入失败:', e);
//     return { success: false, code: -2, errorMsg: '服务器数据存储异常，请稍后重试' };
//   }

//   // 3. 发送短信
//   try {
//     // 调用 uniCloud.sendSms API
//     const smsRes = await uniCloud.sendSms({
//       phone,
//       templateId: '36702', // 确保这个模板ID在DCloud开发者中心审核通过
//       data: { code }
//     });
//     console.log('[sendSmsCode] 短信API调用结果:', smsRes);

//     // 检查API返回结果
//     if (smsRes.errCode === 0) {
//       console.log(`[sendSmsCode] 短信已成功发送至 ${phone}`);
//       return { success: true };
//     } else {
//       // API返回错误，明确告知前端失败
//       console.error(`[sendSmsCode] 短信发送失败，错误码: ${smsRes.errCode}, 错误信息: ${smsRes.errMsg}`);
//       return { success: false, code: -3, errorMsg: `短信发送失败: ${smsRes.errMsg}` };
//     }
//   } catch (err) {
//     // API调用本身发生异常（比如网络问题、配置问题）
//     console.error('[sendSmsCode] 调用短信API时发生未知异常:', err);
//     // 关键修正：这里必须返回 success: false
//     return { success: false, code: -4, errorMsg: '短信服务调用异常，请检查后台配置' };
//   }
// };



'use strict';
const db = uniCloud.database();

// ✅ 写死 AppID，避免配置错误导致异常
const HARDCODED_APPID = '__UNI__3B0C11F';

// 生成4位数字验证码
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// 短信模板与变量映射表
const TEMPLATES = {
  code:            { templateId: '36702', vars: ['code'] },
  new:             { templateId: '36742', vars: ['serviceDate','serviceHour','detailAddress'] },
  user_cancel:     { templateId: '36747', vars: ['serviceDate','serviceHour','refundAmount'] },
  worker_cancel:   { templateId: '36748', vars: ['serviceDate','serviceHour','cancellationReason'] }
};

exports.main = async (event, context) => {
  // 1. 确定短信类型
  let eventType = event.eventType;
  if (!eventType && event.phone) eventType = 'code';

  console.log('[sendSmsCode] eventType:', eventType, 'params:', JSON.stringify(event));

  // 2. AppID 获取顺序：client → context → 写死
  const appId = event.clientInfo?.appId || context.clientInfo?.appId || HARDCODED_APPID;
  console.log(`[sendSmsCode] Using AppID: ${appId}`);

  if (!appId) {
    return { success: false, code: -10, errorMsg: 'AppID 缺失，短信中止' };
  }

  // 3. 发送验证码短信
  if (eventType === 'code') {
    const { phone } = event;
    if (!/^1\d{10}$/.test(phone)) {
      return { success: false, code: -1, errorMsg: '请输入有效的手机号' };
    }

    const code = generateCode();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.collection('SmsCodes').add({ phone, code, expireAt, createdAt: new Date() });

    const tpl = TEMPLATES.code;
    try {
      const smsRes = await uniCloud.sendSms({ phone, templateId: tpl.templateId, data: { code }, appid: appId });
      if (smsRes.errCode === 0) return { success: true };
      return { success: false, code: smsRes.errCode, errorMsg: smsRes.errMsg };
    } catch (err) {
      console.error('[sendSmsCode] 验证码发送异常:', err);
      return { success: false, code: -4, errorMsg: '短信服务调用异常' };
    }
  }

  // 4. 其他类型短信（如预约通知、取消通知）
  const mapping = TEMPLATES[eventType];
  if (!mapping) return { success: false, code: -5, errorMsg: `未知短信类型：${eventType}` };

  const { appointment } = event;
  if (!appointment) return { success: false, code: -6, errorMsg: '缺少 appointment 对象' };

  // 5. 获取接收人手机号
  let phone;
  if (['new', 'user_cancel'].includes(eventType)) phone = appointment.workerPhone;
  else if (eventType === 'worker_cancel') phone = appointment.userPhone;
  if (!phone) return { success: false, code: -7, errorMsg: '接收手机号缺失' };

  // 6. 构造短信变量
  const data = {};
  mapping.vars.forEach((key, idx) => {
    const index = idx + 1;
    switch (key) {
      case 'serviceDate': data[index] = appointment.serviceDate; break;
      case 'serviceHour': data[index] = appointment.serviceHour; break;
      case 'detailAddress': data[index] = appointment.serviceAddress?.name || ''; break;
      case 'refundAmount': data[index] = appointment.refundAmount; break;
      case 'cancellationReason': data[index] = appointment.cancellationReason; break;
      default: data[index] = event[key] || appointment[key] || ''; break;
    }
  });

  console.log('[sendSmsCode] 短信参数:', JSON.stringify({ phone, templateId: mapping.templateId, data, appid: appId }));

  // 7. 发送短信
  try {
    const smsRes = await uniCloud.sendSms({ phone, templateId: mapping.templateId, data, appid: appId });
    if (smsRes.errCode === 0) return { success: true, smsId: smsRes.smsId };
    return { success: false, code: smsRes.errCode, errorMsg: smsRes.errMsg };
  } catch (err) {
    console.error('[sendSmsCode] 短信发送异常:', err);
    return { success: false, code: -8, errorMsg: '短信服务调用异常' };
  }
};
