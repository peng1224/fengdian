//getCommentsByTechnicianId
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	const { technicianId, page = 1, pageSize = 10 } = event;
	
	if (!technicianId) {
		return { success: false, message: '缺少技工ID' };
	}

	try {
		const res = await db.collection('Homepage')
			.doc(technicianId)
			.field({ 'comments': 1, 'name': 1, 'avatar': 1 }) // 只查询需要的字段
			.get();

		if (!res.data || res.data.length === 0) {
			return { success: false, message: '未找到该技工信息' };
		}

		const doc = res.data[0];
		const allComments = doc.comments || [];
		
		// 按创建时间降序排序
		allComments.sort((a, b) => b.createdAt - a.createdAt);

		const total = allComments.length;
		
		// 在云函数中进行分页
		const startIndex = (page - 1) * pageSize;
		const commentData = allComments.slice(startIndex, startIndex + pageSize);

		return {
			success: true,
			commentData, // 分页后的评论数据
			total, // 总评论数
			techInfo: { // 附带技工基本信息
				name: doc.name,
				avatar: doc.avatar
			}
		};

	} catch (e) {
		console.error(e);
		return { success: false, message: '数据库查询失败' };
	}
};