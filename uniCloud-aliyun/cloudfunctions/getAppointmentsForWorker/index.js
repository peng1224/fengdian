// getAppointmentsForWorker.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    // 从前端接收 workerId 和 date
    const { workerId, date } = event;

    // 参数校验
    if (!workerId || !date) {
        return {
            success: false,
            code: 'PARAM_ERROR',
            message: '参数缺失：必须提供师傅ID和日期',
        };
    }

    try {
        // 获取指定日期师傅的所有预约，无论状态如何
        const res = await db.collection('appointments')
            .where({
                workerId: workerId,
                serviceDate: date
            })
            // 返回所有需要的详细字段
            .field({
                _id: true,
                serviceDate: true,
                serviceHour: true,
                userName: true,
                userPhone: true,
                remark: true,
                status: true, // 【重要】返回status字段
                serviceAddress: true // 【新增】返回包含经纬度的地址对象
            })
            .get();

        return {
            success: true,
            message: '查询成功',
            data: res.data
        };

    } catch (err) {
        console.error('getAppointmentsForWorker (for worker schedule) Error:', err);
        return {
            success: false,
            code: 'DB_ERROR',
            message: '数据库查询失败',
            error: err,
        };
    }
};