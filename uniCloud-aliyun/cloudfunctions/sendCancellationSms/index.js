//sendCancellationSms
'use strict';

// sendCancellationSms 云函数
exports.main = async (event, context) => {
    console.log('【sendCancellationSms】接收到的事件参数:', event);
    const { appointment } = event;

    // 1. 参数校验：确保所有必要的预约信息和取消原因都已传入
    if (!appointment || !appointment.serviceDate || !appointment.serviceHour || !appointment.cancellationReason || !appointment.status) {
        console.error('【sendCancellationSms】缺少必要的预约信息或取消原因，无法发送短信。', appointment);
        return { success: false, code: -1, errorMsg: '缺少必要的预约信息或取消原因，短信发送失败' }; // 模仿 sendSmsCode 返回 errorMsg
    }

    const { workerPhone, userPhone, serviceDate, serviceHour, cancellationReason, status } = appointment;

    let targetPhone = '';
    let smsTemplateId = '';
    let messagePrefix = ''; // 用于日志和返回信息

    // !!! 重要：请替换为您的短信模板ID !!!
    // 请确保这些模板ID与您在DCloud短信服务后台配置的模板内容完全匹配
    // 用户取消预约，通知工人的模板ID
    const USER_CANCEL_NOTIFY_WORKER_TEMPLATE_ID = '36747'; // 例如: '36743'
    // 工人取消预约，通知用户的模板ID
    const WORKER_CANCEL_NOTIFY_USER_TEMPLATE_ID = '36748'; // 例如: '36744'

    // 2. 根据预约状态判断接收方和短信模板
    if (status === 'cancelled_by_worker') {
        // 工人取消，通知用户
        if (!userPhone) {
            console.error('【sendCancellationSms】工人取消，但用户手机号缺失。');
            return { success: false, code: -3, errorMsg: '用户手机号缺失，无法通知用户' }; // 模仿 sendSmsCode 返回 errorMsg
        }
        targetPhone = userPhone;
        smsTemplateId = WORKER_CANCEL_NOTIFY_USER_TEMPLATE_ID; // 使用工人取消通知用户的模板
        messagePrefix = '用户';
    } else if (status === 'cancelled_by_user') {
        // 用户取消，通知工人
        if (!workerPhone) {
            console.error('【sendCancellationSms】用户取消，但工人手机号缺失。');
            return { success: false, code: -4, errorMsg: '工人手机号缺失，无法通知工人' }; // 模仿 sendSmsCode 返回 errorMsg
        }
        targetPhone = workerPhone;
        smsTemplateId = USER_CANCEL_NOTIFY_WORKER_TEMPLATE_ID; // 使用用户取消通知工人的模板
        messagePrefix = '工人';
    } else {
        console.warn('【sendCancellationSms】预约状态不是取消状态（cancelled_by_worker 或 cancelled_by_user），不发送取消短信。当前状态:', status);
        return { success: false, code: -2, errorMsg: '非取消状态，不发送短信' }; // 模仿 sendSmsCode 返回 errorMsg
    }

    console.log(`【sendCancellationSms】准备向${messagePrefix} ${targetPhone} 发送取消预约短信...`);
    console.log(`短信内容变量: 日期=${serviceDate}, 时间=${serviceHour}, 原因=${cancellationReason}`);
    // 【新增日志】打印即将发送的短信参数
    console.log('【sendCancellationSms】调用 uniCloud.sendSms 参数:', {
        phone: targetPhone,
        templateId: smsTemplateId,
        data: {
            '1': serviceDate,
            '2': serviceHour,
            '3': cancellationReason
        }
    });

    // 3. 调用 UniCloud 内置短信服务发送短信 (模仿 sendSmsCode 逻辑)
    try {
        const smsRes = await uniCloud.sendSms({
            phone: targetPhone, // 内置API接收单个手机号字符串
            templateId: smsTemplateId,
            data: {
                '1': serviceDate,
                '2': serviceHour,
                '3': cancellationReason // 取消原因
            }
        });

        console.log('【sendCancellationSms】短信API调用结果:', smsRes); // 模仿 sendSmsCode 打印结果

        // 4. 检查API返回结果 (模仿 sendSmsCode 逻辑)
        if (smsRes.errCode === 0) { // 内置API成功返回的errCode是0
            console.log(`【sendCancellationSms】取消预约短信已成功发送给${messagePrefix} ${targetPhone}，短信ID: ${smsRes.smsId}`);
            return { success: true, smsId: smsRes.smsId }; // 模仿 sendSmsCode 返回 success: true
        } else {
            // 短信API返回错误，记录详细信息并返回失败
            console.error(`【sendCancellationSms】短信发送失败，错误码: ${smsRes.errCode}, 错误信息: ${smsRes.errMsg}`);
            return { success: false, code: smsRes.errCode, errorMsg: `短信发送失败: ${smsRes.errMsg}` }; // 模仿 sendSmsCode 返回 errorMsg
        }
    } catch (err) {
        // 调用短信API本身发生异常（例如网络问题、配置问题等）
        console.error(`【sendCancellationSms】调用短信API时发生未知异常给 ${targetPhone}:`, err);
        return { success: false, code: -5, errorMsg: '短信服务调用异常，请检查后台配置或网络' }; // 模仿 sendSmsCode 返回 errorMsg
    }
};
