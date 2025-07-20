//getAppointmentsByWorker
'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
    const { workerId, date } = event;

    if (!workerId || !date) {
        return { success: false, code: 'PARAM_ERROR', message: '参数缺失' };
    }

    try {
        const res = await db.collection('appointments')
            .aggregate()
            .match({
                workerId: workerId,
                serviceDate: date,
                // 【核心修改】只将状态为 "confirmed" (已确认) 的预约视为已占用
                status: 'confirmed'
            })
            .project({
                _id: 0,
                serviceHour: 1
            })
            .end();

        const bookedHours = res.data.map(item => item.serviceHour);

        return {
            success: true,
            message: '查询成功',
            data: bookedHours,
        };

    } catch (err) {
        console.error('getAppointmentsByWorker Error:', err);
        return { success: false, code: 'DB_ERROR', message: '数据库查询失败' };
    }
};
