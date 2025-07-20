<template>
	<view class="all-comments-page">
		<view class="technician-header" v-if="technicianInfo">
			<image :src="technicianInfo.avatar" class="header-avatar" />
			<view class="header-name">{{ technicianInfo.name }} 的全部评价</view>
		</view>

		<view class="comment-list">
			<view v-if="loading" class="loading-tip">加载中...</view>
			<view v-if="!loading && comments.length === 0" class="no-data-tip">暂无用户评价</view>
			
			<view class="comment-item" v-for="item in comments" :key="item.appointmentId">
				<view class="comment-header">
					<image class="comment-avatar" :src="item.avatar" />
					<view class="comment-info">
						<view class="comment-name">{{ item.name }}</view>
						<view class="comment-date">{{ formatDate(item.createdAt) }}</view>
					</view>
				</view>
				<view class="comment-rating" v-if="item.rating">
					<text v-for="star in 5" :key="star" class="star" :class="{ 'active': star <= item.rating }">★</text>
				</view>
				<view class="comment-content">{{ item.comment }}</view>
				<view class="comment-images" v-if="item.images && item.images.length > 0">
					<image v-for="(img, imgIndex) in item.images" :key="imgIndex" :src="img" mode="aspectFill" class="comment-img" @click="previewCommentImage(item.images, img)" />
				</view>

				<view class="comment-actions">
					<view class="reply-btn" @click="toggleReplyInput(item.appointmentId)">回复</view>
				</view>
				
				<view class="replies-wrapper" v-if="item.replies && item.replies.length > 0">
					<view class="reply-list" v-show="replyState[item.appointmentId]?.showReplies">
						<view class="reply-item" v-for="reply in item.replies" :key="reply.replyId">
							<image class="reply-avatar" :src="reply.userAvatar" />
							<view class="reply-content">
								<view class="reply-header">
									<text class="reply-name">{{ reply.userName }}</text>
									<text class="reply-date">{{ formatDate(reply.createdAt) }}</text>
								</view>
								<view class="reply-text">{{ reply.content }}</view>
							</view>
						</view>
					</view>
					<view class="toggle-replies" @click="toggleReplies(item.appointmentId)">
						{{ replyState[item.appointmentId]?.showReplies ? '收起回复' : `查看全部 ${item.replies.length} 条回复` }}
					</view>
				</view>
				
				<!-- 回复输入区域 -->
				<view class="reply-input-area" v-if="replyState[item.appointmentId]?.showInput">
					<input class="reply-input" v-model="replyState[item.appointmentId].content" placeholder="输入你的回复..." />
					<button class="reply-submit-btn" size="mini" @click="handleReplySubmit(item.appointmentId)">发送</button>
				</view>
			</view>
		</view>

		<view class="load-more-tip">
			<text v-if="isLoadMore">正在加载...</text>
			<text v-if="!hasMoreData && comments.length > 0">没有更多评价了</text>
		</view>

	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';

const technicianId = ref('');
const technicianInfo = ref(null);
const comments = ref([]);
const replyState = reactive({}); // 存储每个评论的回复UI状态

const loading = ref(true);
const isLoadMore = ref(false);
const hasMoreData = ref(true);
const page = ref(1);
const pageSize = 10;

onLoad((options) => {
	if (options.technicianId) {
		technicianId.value = options.technicianId;
		fetchComments();
	} else {
		uni.showToast({ title: '参数错误', icon: 'none' });
		loading.value = false;
	}
});

onReachBottom(() => {
	if (hasMoreData.value && !isLoadMore.value) {
		page.value++;
		fetchComments(true); // 加载下一页
	}
});

/**
 * @description 从云端获取评论数据
 * @param {boolean} isLoadMoreAction - 是否为加载更多操作
 */
const fetchComments = async (isLoadMoreAction = false) => {
	if (isLoadMoreAction) {
		isLoadMore.value = true;
	} else {
		loading.value = true;
		page.value = 1; // 重置页码
		comments.value = []; // 清空旧数据
	}

	try {
		const res = await uniCloud.callFunction({
			name: 'getCommentsByTechnicianId',
			data: {
				technicianId: technicianId.value,
				page: page.value,
				pageSize: pageSize
			}
		});

		if (res.result.success) {
			const { commentData, total, techInfo } = res.result;
			
			if (!technicianInfo.value) {
				technicianInfo.value = techInfo;
			}
			
			// 为新加载的评论初始化回复状态
			commentData.forEach(comment => {
				if (!replyState[comment.appointmentId]) {
					replyState[comment.appointmentId] = {
						showReplies: false,
						showInput: false,
						content: ''
					};
				}
			});

			// 【修复】正确地追加或设置评论数据
			comments.value = isLoadMoreAction ? [...comments.value, ...commentData] : commentData;

			// 判断是否还有更多数据
			hasMoreData.value = comments.value.length < total;

		} else {
			uni.showToast({ title: res.result.message || '加载失败', icon: 'none' });
		}
	} catch (error) {
		console.error("加载评论失败: ", error);
		uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' });
	} finally {
		// 【优化】确保加载状态总是被重置
		loading.value = false;
		isLoadMore.value = false;
	}
};

/**
 * @description 切换回复输入框的显示/隐藏
 * @param {string} appointmentId - 评论关联的预约ID
 */
const toggleReplyInput = (appointmentId) => {
	if (!replyState[appointmentId]) return;
	replyState[appointmentId].showInput = !replyState[appointmentId].showInput;
};

/**
 * @description 切换回复列表的显示/隐藏
 * @param {string} appointmentId - 评论关联的预约ID
 */
const toggleReplies = (appointmentId) => {
	if (!replyState[appointmentId]) return;
	replyState[appointmentId].showReplies = !replyState[appointmentId].showReplies;
};

/**
 * @description 【核心新增】处理回复提交的逻辑
 * @param {string} appointmentId - 评论关联的预约ID
 */
const handleReplySubmit = async (appointmentId) => {
	const currentState = replyState[appointmentId];
	const content = currentState.content.trim();

	if (!content) {
		uni.showToast({ title: '回复内容不能为空', icon: 'none' });
		return;
	}

	const userInfo = uni.getStorageSync('userinfo');
	if (!userInfo || !userInfo._id) {
		uni.showToast({ title: '请先登录', icon: 'none' });
		return;
	}

	uni.showLoading({ title: '正在发送...' });

	try {
		const replyData = {
			content: content,
			userId: userInfo._id,
			userName: userInfo.name,
			userAvatar: userInfo.avatar
		};

		// 注意：请确保你有一个名为 'addCommentReply' 的云函数来处理回复逻辑
		const res = await uniCloud.callFunction({
			name: 'addCommentReply', 
			data: {
				appointmentId: appointmentId,
				replyData: replyData
			}
		});

		if (res.result.success) {
			// 在本地数据中找到对应的评论并更新它
			const comment = comments.value.find(c => c.appointmentId === appointmentId);
			if (comment) {
				if (!comment.replies) {
					comment.replies = [];
				}
				// 将新回复添加到本地列表，实现UI即时更新
				comment.replies.push({
					...replyData,
					replyId: res.result.replyId, // 假设后端返回了新回复的ID
					createdAt: Date.now()
				});
			}

			// 重置UI状态
			currentState.content = '';
			currentState.showInput = false;
			currentState.showReplies = true; // 添加新回复后自动展开回复列表

			uni.hideLoading();
			uni.showToast({ title: '回复成功', icon: 'success' });
		} else {
			throw new Error(res.result.message || '回复失败');
		}
	} catch (error) {
		uni.hideLoading();
		console.error("回复失败: ", error);
		uni.showToast({ title: error.message || '网络错误，请稍后重试', icon: 'none' });
	}
};

/**
 * @description 预览评论中的图片
 * @param {string[]} images - 当前评论的所有图片URL数组
 * @param {string} currentImage - 当前点击的图片URL
 */
const previewCommentImage = (images, currentImage) => {
    uni.previewImage({
        urls: images,
        current: currentImage
    });
};

/**
 * @description 【新增】格式化日期的辅助函数
 * @param {number} timestamp - 时间戳
 */
const formatDate = (timestamp) => {
	if (!timestamp) return '';
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
};
</script>

<style scoped lang="scss">
.all-comments-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.technician-header {
	display: flex;
	align-items: center;
	padding: 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
}

.header-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.header-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.comment-list {
	padding: 0 20rpx;
}

.loading-tip, .no-data-tip {
	text-align: center;
	color: #999;
	padding: 80rpx 0;
}

.comment-item {
	background-color: #fff;
	padding: 25rpx;
	margin-top: 20rpx;
	border-radius: 12rpx;
}

.comment-header {
	display: flex;
	align-items: center;
}

.comment-avatar {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.comment-info {
	flex: 1;
}

.comment-name {
	font-size: 28rpx;
	color: #333;
}

.comment-date {
	font-size: 24rpx;
	color: #999;
	margin-top: 5rpx;
}

.comment-rating {
	margin-top: 15rpx;
}

.star {
	font-size: 30rpx;
	color: #ddd;
	margin-right: 5rpx;
}

.star.active {
	color: #ffc107;
}

.comment-content {
	margin-top: 20rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #333;
}

.comment-images {
	margin-top: 20rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.comment-img {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	background-color: #f0f0f0;
}

.comment-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 20rpx;
}

.reply-btn {
	font-size: 24rpx;
	color: #007aff;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	background-color: #f0f0f0;
}

.replies-wrapper {
	margin-top: 20rpx;
	background-color: #f8f8f8;
	border-radius: 8rpx;
	padding: 20rpx;
}

.reply-list .reply-item {
	display: flex;
	margin-bottom: 20rpx;
}
.reply-list .reply-item:last-child {
	margin-bottom: 0;
}

.reply-avatar {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	margin-right: 15rpx;
}

.reply-content {
	flex: 1;
}

.reply-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.reply-name {
	font-size: 26rpx;
	color: #555;
	font-weight: bold;
}

.reply-date {
	font-size: 22rpx;
	color: #aaa;
}

.reply-text {
	font-size: 26rpx;
	color: #333;
	margin-top: 8rpx;
	line-height: 1.5;
}

.toggle-replies {
	font-size: 24rpx;
	color: #007aff;
	margin-top: 20rpx;
	text-align: left;
}

.reply-input-area {
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	gap: 15rpx;
}

.reply-input {
	flex: 1;
	height: 60rpx;
	font-size: 26rpx;
	background-color: #f0f0f0;
	border-radius: 30rpx;
	padding: 0 25rpx;
}

.reply-submit-btn {
	background-color: #007aff;
	color: white;
	border-radius: 30rpx;
	line-height: 60rpx;
	height: 60rpx;
	padding: 0 30rpx;
	margin: 0;
}

.load-more-tip {
	text-align: center;
	color: #999;
	font-size: 24rpx;
	padding: 30rpx 0;
}
</style>
