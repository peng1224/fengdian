'use strict';

// sendNewAppointmentSms 云函数
exports.main = async (event, context) => {
    console.log('【sendNewAppointmentSms】接收到的事件参数:', event);
    const { appointment } = event;

    // 1. 参数校验：确保所有必要的预约信息都已传入
    if (!appointment || !appointment.workerPhone || !appointment.serviceDate || !appointment.serviceHour || !appointment.serviceAddress || !appointment.serviceAddress.name) {
        console.error('【sendNewAppointmentSms】缺少必要的预约信息，无法发送短信。', appointment);
        return { success: false, code: -1, errorMsg: '缺少必要的预约信息，短信发送失败' }; // 模仿 sendSmsCode 返回 errorMsg
    }

    const { workerPhone, serviceDate, serviceHour, serviceAddress } = appointment;
    const detailAddress = serviceAddress.name;

    // !!! 重要：请替换为您的短信模板ID !!!
    // 此模板ID应对应您在DCloud短信服务后台审核通过的模板内容：
    // "您有新预约！时间：${1} ${2}，地点：${3}。请立即登录蜂点到家App查看详情！"
    const SMS_TEMPLATE_ID = '36742'; // <--- 务必替换为实际的模板ID，例如 '123456'

    console.log(`【sendNewAppointmentSms】准备向工人 ${workerPhone} 发送新预约短信...`);
    console.log(`短信内容变量: 日期=${serviceDate}, 时间=${serviceHour}, 地址=${detailAddress}`);
    // 【新增日志】打印即将发送的短信参数
    console.log('【sendNewAppointmentSms】调用 uniCloud.sendSms 参数:', {
        phone: workerPhone,
        templateId: SMS_TEMPLATE_ID,
        data: {
            '1': serviceDate,
            '2': serviceHour,
            '3': detailAddress
        }
    });

    // 2. 调用 UniCloud 内置短信服务发送短信 (模仿 sendSmsCode 逻辑)
    try {
        const smsRes = await uniCloud.sendSms({
            phone: workerPhone, // 内置API接收单个手机号字符串
            templateId: SMS_TEMPLATE_ID,
            data: {
                '1': serviceDate,
                '2': serviceHour,
                '3': detailAddress
            }
        });

        console.log('【sendNewAppointmentSms】短信API调用结果:', smsRes); // 模仿 sendSmsCode 打印结果

        // 3. 检查API返回结果 (模仿 sendSmsCode 逻辑)
        if (smsRes.errCode === 0) { // 内置API成功返回的errCode是0
            console.log(`【sendNewAppointmentSms】新预约短信已成功发送给工人 ${workerPhone}，短信ID: ${smsRes.smsId}`);
            return { success: true, smsId: smsRes.smsId }; // 模仿 sendSmsCode 返回 success: true
        } else {
            // 短信API返回错误，记录详细信息并返回失败
            console.error(`【sendNewAppointmentSms】短信发送失败，错误码: ${smsRes.errCode}, 错误信息: ${smsRes.errMsg}`);
            return { success: false, code: smsRes.errCode, errorMsg: `短信发送失败: ${smsRes.errMsg}` }; // 模仿 sendSmsCode 返回 errorMsg
        }
    } catch (err) {
        // 调用短信API本身发生异常（例如网络问题、配置问题等）
        console.error(`【sendNewAppointmentSms】调用短信API时发生未知异常给 ${workerPhone}:`, err);
        return { success: false, code: -2, errorMsg: '短信服务调用异常，请检查后台配置或网络' }; // 模仿 sendSmsCode 返回 errorMsg
    }
};
