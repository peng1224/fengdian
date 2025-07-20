//createAppointment
'use strict';

const db = uniCloud.database();
const dbCmd = db.command;

// 默认服务时长（毫秒），用于计算 expectedEndTime
// 假设服务通常持续1小时，您可以根据实际业务调整
const DEFAULT_SERVICE_DURATION_MS = 60 * 60 * 1000; // 1小时
const QQ_MAP_KEY_APP = '3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY';
const DEFAULT_AVATAR = '/static/images/avatar-placeholder.png';

exports.main = async (event, context) => {
  const {
    workerId,
    workerPhone,
    userId,
    userPhone,
    userName,
    serviceDate, // 格式如 "2025-07-15"
    serviceHour, // 格式如 "19:00"
    serviceAddress,
    remark,
    orderId,     // 支付订单号
    total_fee    // 支付金额，单位分
  } = event;

  // 1. 参数校验
  if (
    !workerId ||
    !userId ||
    !serviceDate ||
    !serviceHour ||
    !workerPhone ||
    !userPhone ||
    !userName ||
    !remark ||
    !serviceAddress ||
    !serviceAddress.name ||
    !serviceAddress.detail
  ) {
    console.error('[createAppointment] 关键参数缺失:', {
      workerId, userId, serviceDate, serviceHour, workerPhone, userPhone, userName, remark, serviceAddress
    });
    return {
      success: false,
      code: 'PARAM_ERROR',
      message: '关键参数缺失',
    };
  }

  // 2. 计算 expectedEndTime（修正时区解析）
  let expectedEndTime;
  try {
    // 用 ISO 8601 格式并包含 +08:00 东八区时区
    const isoString = `${serviceDate}T${serviceHour}:00+08:00`;
    const serviceStartDate = new Date(isoString);
    if (isNaN(serviceStartDate.getTime())) {
      throw new Error(`Invalid date: ${isoString}`);
    }

    // 计算预计结束时间
    expectedEndTime = serviceStartDate.getTime() + DEFAULT_SERVICE_DURATION_MS;
    console.log(
      `[createAppointment] 服务开始 (ISO+08): ${serviceStartDate.toISOString()}, ` +
      `预计结束: ${new Date(expectedEndTime).toISOString()}`
    );
  } catch (e) {
    console.error('[createAppointment] 时间解析或计算失败:', e);
    return {
      success: false,
      code: 'TIME_CALC_ERROR',
      message: '计算服务结束时间失败',
    };
  }

  // 3. 校验时间段是否已被预约
  try {
    const existing = await db.collection('appointments')
      .where({
        workerId,
        serviceDate,
        serviceHour,
        status: dbCmd.in(['confirmed', 'in_progress'])
      })
      .count();

    if (existing.total > 0) {
      console.warn(
        `[createAppointment] 时段已被预约: workerId=${workerId}, ` +
        `date=${serviceDate}, hour=${serviceHour}`
      );
      return {
        success: false,
        code: 'SLOT_TAKEN',
        message: '手慢了，该时段已被预约',
      };
    }
  } catch (err) {
    console.error('[createAppointment] 校验预约时段失败:', err);
    return {
      success: false,
      code: 'DB_ERROR',
      message: '校验预约时段失败',
    };
  }

  // 4. 写入数据库
  let newAppointmentId;
  try {
    const res = await db.collection('appointments').add({
      workerId,
      workerPhone,
      userId,
      userPhone,
      userName,
      serviceDate,
      serviceHour,
      serviceAddress,
      remark,
      status: 'confirmed',
      orderId,
      payStatus: 'PAID',
      total_fee,
      createdAt: Date.now(),
      expectedEndTime
    });
    newAppointmentId = res.id;
    console.log(`[createAppointment] 预约成功创建，ID: ${newAppointmentId}`);
  } catch (err) {
    console.error('[createAppointment] 创建预约失败:', err);
    return {
      success: false,
      code: 'DB_ERROR',
      message: '创建预约失败，请稍后再试',
    };
  }


  // 5. 调用短信通知云函数（失败不影响主流程）
  try {
    // 这里的逻辑先保持不变，等待上一步日志的结果
    const clientInfo = (event.args && event.args.clientInfo) ? event.args.clientInfo : (event.clientInfo || context.clientInfo || {});

    console.log('[createAppointment] 准备透传的 clientInfo:', JSON.stringify(clientInfo));
    
    await uniCloud.callFunction({
      name: 'sendSmsCode',
      data: {
        eventType: 'new',
        appointment: {
          workerPhone,
          serviceDate,
          serviceHour,
          serviceAddress: { name: serviceAddress.name }
        },
        clientInfo
      }
    });

    console.log('[createAppointment] 新预约短信通知已发出');
  } catch (err) {
    console.error('[createAppointment] 短信通知调用失败:', err);
  }



  // 6. 发送系统消息到聊天（失败不影响主流程）
  try {
    const users = [userPhone, workerPhone].sort();
    let sessionId;

    const chatRes = await db.collection('ChatSession')
      .where({ users })
      .limit(1)
      .get();

    if (chatRes.data.length > 0) {
      sessionId = chatRes.data[0]._id;
    } else {
      const addRes = await db.collection('ChatSession').add({
        users,
        lastMessage: '我们已经成为好友，开始聊天吧！',
        lastTime: Date.now(),
        unreadCount: {},
        createdAt: Date.now()
      });
      sessionId = addRes.id;
    }

    // 构造并发送文本消息
    const textMsg = {
      type: 'text',
      sender: userPhone,
      avatarUrl: DEFAULT_AVATAR,
      name: userName,
      sessionId,
      message:
        `您有一个新的预约！\n` +
        `服务日期：${serviceDate}\n` +
        `服务时间：${serviceHour}\n` +
        `用户电话：${userPhone}\n` +
        `服务需求：${remark}`,
      timestamp: Date.now(),
      isSystemMessage: true,
      messageType: 'appointment_created'
    };
    await db.collection('ChatMessages').add(textMsg);

    // 构造并发送位置消息
    const { latitude, longitude, name, address, detail } = serviceAddress;
    const fullAddr = `${address}${detail || ''}`;
    const thumbUrl = `https://apis.map.qq.com/ws/staticmap/v2/?center=${latitude},${longitude}` +
                     `&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${latitude},${longitude}` +
                     `&key=${QQ_MAP_KEY_APP}`;

    const locMsg = {
      type: 'location',
      sender: userPhone,
      avatarUrl: DEFAULT_AVATAR,
      name: userName,
      sessionId,
      timestamp: Date.now(),
      isSystemMessage: true,
      location: { latitude, longitude, name, address: fullAddr, thumbUrl },
      messageType: 'appointment_created'
    };
    await db.collection('ChatMessages').add(locMsg);

    // 更新会话未读数与最后消息
    await db.collection('ChatSession').doc(sessionId).update({
      lastMessage: '您有一个新的预约',
      lastTime: Date.now(),
      [`unreadCount.${workerPhone}`]: dbCmd.inc(2)
    });

  } catch (err) {
    console.warn('[createAppointment] 系统消息发送失败，不影响主流程:', err);
  }

  // 7. 返回成功结果
  return {
    success: true,
    message: '预约成功',
    data: { _id: newAppointmentId }
  };
};
