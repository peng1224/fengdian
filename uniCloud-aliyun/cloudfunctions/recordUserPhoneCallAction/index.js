'use strict';
const crypto = require('crypto');
const db = uniCloud.database();

// ============= 密鑰校驗 =============
// 請在 uniCloud web 控制台此雲函數的 "環境變量" 中配置 ENCRYPT_KEY 和 IV
const validateKeys = () => {
  if (!process.env.ENCRYPT_KEY || process.env.ENCRYPT_KEY.length !== 64) {
    // AES-256-CBC 需要 32 字節的密鑰，即 64 個十六進制字符
    throw new Error("ENCRYPT_KEY 必須是64位十六進制字符");
  }
  if (!process.env.IV || process.env.IV.length !== 32) {
    // IV 需要 16 字節，即 32 個十六進制字符
    throw new Error("IV 必須是32位十六進制字符");
  }
}
// =====================================

const encrypt = (text, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const isValidChineseMobile = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
}

exports.main = async (event, context) => {
  const { actionType, targetId, targetPhoneNumber, callerPhoneNumber } = event;

  try {
    validateKeys(); // 校驗密鑰配置

    if (!isValidChineseMobile(targetPhoneNumber)) {
      throw new Error('無效的目標手機號碼格式');
    }

    const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
    const IV = process.env.IV;

    const maskedPhone = targetPhoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    const encryptedPhone = encrypt(targetPhoneNumber, ENCRYPT_KEY, IV);
    
    const result = await db.collection('PhonecallAction').add({
      data: {
        actionType,
        targetId,
        callerPhoneNumber, // 關鍵改動：記錄撥打者電話
        encryptedPhone,
        maskedPhone,
        timestamp: Date.now(),
        createTime: new Date(),
        _meta: {
          encryptVersion: 'AES-256-CBC',
          keyHash: crypto.createHash('sha256').update(ENCRYPT_KEY).digest('hex')
        }
      }
    });

    return { success: true, data: { recordId: result.id, maskedPhone } };

  } catch (err) {
    console.error('雲函數執行失敗:', err);
    return { success: false, message: err.message };
  }
};