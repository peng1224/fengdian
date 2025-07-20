// 文件: uniCloud/cloudfunctions/get-latest-messages/index.js
'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
	const { sessionId, lastTimestamp } = event;
	if (!sessionId || !lastTimestamp) {
		return { success: false, message: '缺少参数' };
	}

	try {
		// 查询指定会话中，时间戳晚于客户端最新一条消息时间的所有消息
		const res = await db.collection('ChatMessages')
			.where({
				sessionId: sessionId,
				timestamp: dbCmd.gt(lastTimestamp) // 使用 gt() 查询 > lastTimestamp 的消息
			})
			.orderBy('timestamp', 'asc') // 按时间正序返回
			.get();
			
		return { success: true, data: res.data };

	} catch (error) {
		console.error('获取最新消息失败', error);
		return { success: false, message: '获取最新消息失败' };
	}
};