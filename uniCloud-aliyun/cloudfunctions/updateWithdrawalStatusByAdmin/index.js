// 云函数：updateWithdrawalStatusByAdmin
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
    const { withdrawalRequestId, newStatus, adminId, remarks } = event;

    console.log('[updateWithdrawalStatusByAdmin] 云函数开始执行。');
    console.log('[updateWithdrawalStatusByAdmin] 接收参数：', { withdrawalRequestId, newStatus, adminId, remarks });

    if (!withdrawalRequestId || !newStatus || !adminId) {
        console.error('[updateWithdrawalStatusByAdmin] 参数校验失败：提现请求ID、新状态或管理员ID缺失。');
        return { success: false, message: '参数缺失' };
    }

    // 校验新状态是否合法
    const validStatuses = ['completed', 'rejected', 'failed'];
    if (!validStatuses.includes(newStatus)) {
        console.warn(`[updateWithdrawalStatusByAdmin] 无效的新状态: ${newStatus}`);
        return { success: false, message: '无效的提现状态' };
    }

    const transaction = await db.startTransaction();
    console.log('[updateWithdrawalStatusByAdmin] 数据库事务已启动。');

    try {
        // 1. 查询提现请求详情
        console.log(`[updateWithdrawalStatusByAdmin] 查询提现请求: ${withdrawalRequestId}`);
        const requestRes = await transaction.collection('withdrawal_requests').doc(withdrawalRequestId).get();
        console.log('[updateWithdrawalStatusByAdmin] 提现请求查询结果:', requestRes.data);

        // 修正点：首先检查 requestRes.data 是否存在
        if (!requestRes.data) {
            console.error(`[updateWithdrawalStatusByAdmin] 提现请求ID ${withdrawalRequestId} 未找到。`);
            await transaction.rollback();
            return { success: false, message: '提现请求未找到或已被处理' };
        }

        // 2. 检查当前状态，确保只能处理 'pending_review' 状态的请求
        if (requestRes.data.status !== 'pending_review') {
            console.warn(`[updateWithdrawalStatusByAdmin] 提现请求 ${withdrawalRequestId} 状态不正确 (${requestRes.data.status})，无法处理。`);
            await transaction.rollback();
            return { success: false, message: '提现请求状态不正确，无法处理' };
        }

        const relatedSettlementIds = requestRes.data.relatedSettlementIds || [];

        // 3. 更新 withdrawal_requests 状态
        console.log(`[updateWithdrawalStatusByAdmin] 更新 withdrawal_requests 状态为 ${newStatus}...`);
        const updateRequestRes = await transaction.collection('withdrawal_requests').doc(withdrawalRequestId).update({
            status: newStatus,
            completedAt: Date.now(), // 记录处理时间
            adminId: adminId,       // 记录处理管理员ID
            remarks: remarks || ''  // 记录管理员备注
        });
        console.log('[updateWithdrawalStatusByAdmin] withdrawal_requests 更新结果:', updateRequestRes);

        if (updateRequestRes.updated !== 1) {
            console.error(`[updateWithdrawalStatusByAdmin] 更新 withdrawal_requests 失败，更新数量不为1。`);
            await transaction.rollback();
            return { success: false, message: '更新提现请求失败' };
        }

        // 4. 更新关联的 worker_settlements 状态 (绕行方案)
        if (relatedSettlementIds.length > 0) {
            let settlementNewStatus = newStatus;
            if (newStatus === 'rejected') {
                // 如果是拒绝，将收入明细状态改回 'pending'，以便工人可以再次提现
                settlementNewStatus = 'pending';
            }

            console.log(`[updateWithdrawalStatusByAdmin] 准备逐条更新 ${relatedSettlementIds.length} 条 worker_settlements 记录的状态为 ${settlementNewStatus}...`);
            
            let updatedCount = 0;
            for (const settlementId of relatedSettlementIds) {
                try {
                    const res = await transaction.collection('worker_settlements').doc(settlementId)
                        .update({
                            status: settlementNewStatus
                        });
                    if (res.updated === 1) {
                        updatedCount++;
                    } else {
                        console.warn(`[updateWithdrawalStatusByAdmin] worker_settlement ${settlementId} 未被更新，可能状态已变。`);
                    }
                } catch (singleUpdateErr) {
                    console.error(`[updateWithdrawalStatusByAdmin] 更新 worker_settlement ${settlementId} 失败:`, singleUpdateErr);
                    // 如果单个更新失败，我们选择抛出错误，以便整个事务回滚
                    throw new Error(`更新收入明细 ${settlementId} 失败`); 
                }
            }
            console.log(`[updateWithdrawalStatusByAdmin] 实际更新了 ${updatedCount} 条 worker_settlements 记录。`);

            if (updatedCount !== relatedSettlementIds.length) {
                console.warn(`[updateWithdrawalStatusByAdmin] 并非所有 worker_settlements 都被更新。预期 ${relatedSettlementIds.length}，实际 ${updatedCount}。`);
                // 即使这里有警告，如果上面的循环没有抛出错误，表示所有尝试的更新都成功了（或被忽略了，如果状态不匹配）
                // 只有当有明确的更新失败导致抛出错误时，事务才会回滚。
                // 如果您希望严格要求所有记录都必须更新成功，可以在循环中检查 res.updated === 1，不等于1就抛出错误。
                // 当前逻辑是，只要没有抛出错误，就认为成功。
            }
        }

        // 5. 提交事务
        console.log('[updateWithdrawalStatusByAdmin] 尝试提交事务...');
        await transaction.commit();
        console.log('[updateWithdrawalStatusByAdmin] 事务提交成功。');

        return { success: true, message: '提现请求处理成功' };

    } catch (err) {
        console.error('[updateWithdrawalStatusByAdmin] 事务处理过程中发生错误，尝试回滚事务。错误详情：', err);
        await transaction.rollback();
        // 确保返回的错误信息是用户友好的
        return { success: false, message: err.message || '处理提现请求失败，请稍后重试' };
    }
};

