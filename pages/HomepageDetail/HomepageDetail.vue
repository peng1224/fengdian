<template>
  <view v-if="loading" style="padding: 50rpx 30rpx; min-height: 50vh;">
    <view class="skeleton">
      <view class="skeleton-title"></view>
      <view class="skeleton-row" v-for="i in 5" :key="i"></view>
    </view>
  </view>

  <view class="worker-detail" v-if="!loading && detail">
    <swiper class="banner-swiper" autoplay interval="3000" circular indicator-dots>
      <swiper-item v-for="(item, index) in detail.bannerImages" :key="index">
        <image class="banner-img" :src="item" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="basic-info">
      <image class="avatar" :src="detail.avatar" mode="aspectFill" />
      <view class="info-text">
        <view class="name">{{ detail.name }}</view>
        <view class="tags">
          <text v-if="detail.age">  {{ detail.age }}岁</text>
        </view>
        <view class="area">服务区域：{{ detail.serviceArea }}</view>
      </view>
      <view class="like-container" @click="toggleLike">
        <image class="like-icon" :src="`/static/images/${detail.userLiked ? 'like.png' : 'like.no.png'}`"></image>
        <text class="like-count">{{ detail.likeCount }}</text>
      </view>
    </view>

    <view class="service-section">
      <view class="section-title">服务内容</view>
      <view class="tag-list">
        <text class="skill-tag" v-for="(item, index) in detail.skills" :key="index">{{ item }}</text>
      </view>
      <view class="price">参考价格：{{ detail.price }}</view>
    </view>

    <view class="desc-section">
      <view class="section-title">个人简介</view>
      <text class="desc-text">{{ detail.description }}</text>
    </view>

    <view class="comment-section" v-if="detail.comments && detail.comments.length > 0">
      <view class="section-title">用户评价</view>
      <view class="comment-item" v-for="item in visibleComments" :key="item.appointmentId">
        <view class="comment-header">
          <image class="comment-avatar" :src="item.avatar" />
          <view class="comment-info">
            <view class="comment-name">{{ item.name }}</view>
            <view class="comment-date">{{ formatMonthDay(item.createdAt) }}</view>
          </view>
        </view>
        <view class="comment-rating" v-if="item.rating">
          <text v-for="star in 5" :key="star" class="star" :class="{ 'active': star <= item.rating }">★</text>
        </view>
        <view class="comment-content">{{ item.comment }}</view>
        <view class="comment-images" v-if="item.images && item.images.length > 0">
          <image
            v-for="(img, imgIndex) in item.images"
            :key="imgIndex"
            :src="img"
            mode="aspectFill"
            class="comment-img"
          />
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
                  <text class="reply-date">{{ formatMonthDay(reply.createdAt) }}</text>
                </view>
                <view class="reply-text">{{ reply.content }}</view>
              </view>
            </view>
          </view>
          <view class="toggle-replies" @click="toggleReplies(item.appointmentId)">
            {{ replyState[item.appointmentId]?.showReplies
              ? '收起回复'
              : `查看全部 ${item.replies.length} 条回复` }}
          </view>
        </view>

        <view class="reply-input-area" v-if="replyState[item.appointmentId]?.showInput">
          <input
            class="reply-input"
            v-model="replyState[item.appointmentId].content"
            placeholder="输入你的回复..."
          />
          <button
            class="reply-submit-btn"
            size="mini"
            @click="handleReplySubmit(item.appointmentId)"
          >
            发送
          </button>
        </view>
      </view>

      <view class="toggle-more" @click="navigateToAllComments">
        查看全部 {{ detail.comments.length }} 条评论
      </view>
    </view>

    <view class="contact-section">
      <button class="call-btn" @click="handlePhoneCall">拨打电话</button>
      <button class="start-chat-btn" @click="handleStartChat">发起聊天</button>
      <button class="appointment-btn" @click="handleAppointment">预约服务</button>
    </view>

    <view class="media-section" v-if="detail.media && detail.media.length > 0">
      <view class="section-title">施工过程案例展示</view>
      <view class="media-item" v-for="(item, index) in detail.media" :key="index">
        <image v-if="item.type === 'image'" class="media-img" :src="item.src" mode="widthFix" />
        <video v-if="item.type === 'video'" class="media-video" :src="item.src" controls />
      </view>
    </view>
  </view>
</template>


<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const db = uniCloud.database(); // 初始化 uniCloud

// --- State Management ---
const detail = ref(null); // 工人详细信息
const id = ref(''); // 工人主页 ID
const loading = ref(true); // 加载状态
const maskedPhone = ref(''); // 掩码后的电话

// --- 评论区相关新状态 ---
const replyState = reactive({}); // `reactive` 用于管理复杂的回复状态
// 计算属性，用于决定在主页显示多少条评论（例如，最多2条）
const visibleComments = computed(() => {
	if (!detail.value || !detail.value.comments) {
		return [];
	}
	// 始终返回前2条评论
	return detail.value.comments.slice(0, 2);
});

// --- Methods ---
// 新增只渲染“月-日”的函数
const formatMonthDay = (timestamp) => {
  const date = new Date(timestamp);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // 返回 “MM月DD日”，例如“07月01日”
  return `${m.toString().padStart(2,'0')}月${d.toString().padStart(2,'0')}日`;
};

// --- Lifecycle Hooks ---
onLoad((options) => {
	if (options.id) {
		id.value = options.id;
		getDetail();
		recordView(options.id);
	} else {
		uni.showToast({
			title: '无法加载详情',
			icon: 'none'
		});
		loading.value = false;
	}
});

// --- Methods ---
const getDetail = async () => {
	try {
		const res = await uniCloud.callFunction({
			name: 'getHomepageDetail',
			data: { id: id.value }
		});

		if (res.result && res.result.data) {
			let workerDetail = res.result.data;
			const userInfo = uni.getStorageSync('userinfo') || {};
			const currentUserPhone = userInfo.phoneNumber;

			// 基于 phoneNumber 判断今日是否已点赞
			let hasLikedToday = false;
			if (workerDetail.likedBy && Array.isArray(workerDetail.likedBy) && currentUserPhone) {
				const today = new Date().toDateString();
				hasLikedToday = workerDetail.likedBy.some(item =>
					item.phoneNumber === currentUserPhone &&
					new Date(item.likeTime).toDateString() === today
				);
			}
			workerDetail.userLiked = hasLikedToday;

			// 设置默认 banner
			if (!workerDetail.bannerImages || !Array.isArray(workerDetail.bannerImages) || workerDetail.bannerImages.length === 0) {
				workerDetail.bannerImages = ['/static/images/logo.jpg'];
			}
			
			// 按创建时间对评论进行降序排序
			if (workerDetail.comments && Array.isArray(workerDetail.comments)) {
				workerDetail.comments.sort((a,b) => b.createdAt - a.createdAt);
			}

			// 初始化评论的回复状态
			if (workerDetail.comments) {
				workerDetail.comments.forEach(comment => {
					// 使用 appointmentId 作为唯一键
					replyState[comment.appointmentId] = {
						showReplies: false, // 默认不显示回复
						showInput: false,   // 默认不显示输入框
						content: ''         // 回复内容
					};
				});
			}

			// 处理电话号码掩码
			const rawPhone = workerDetail.phoneNumber || '';
			maskedPhone.value = rawPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

			detail.value = workerDetail;
		} else {
			uni.showToast({ title: '加载失败，无数据返回', icon: 'none' });
		}
	} catch (err) {
		console.error('加载详情失败', err);
		uni.showToast({ title: '加载失败，请稍后重试', icon: 'none' });
	} finally {
		loading.value = false;
	}
};

const toggleLike = async () => {
	const userInfo = uni.getStorageSync('userinfo');
	if (!userInfo || !userInfo.phoneNumber) {
		return uni.showToast({ title: "请先登录", icon: "none" });
	}

	// UI 乐观更新
	const originalLiked = detail.value.userLiked;
	const originalCount = detail.value.likeCount;

	detail.value.userLiked = !originalLiked;
	detail.value.likeCount += originalLiked ? -1 : 1;
	uni.vibrateShort();

	try {
		const res = await uniCloud.callFunction({
			name: 'updateLike',
			data: {
				id: id.value,
				phoneNumber: userInfo.phoneNumber
			}
		});

		if (!res.result.success) {
			// 如果后端失败，回滚 UI
			detail.value.userLiked = originalLiked;
			detail.value.likeCount = originalCount;
			uni.showToast({ title: res.result.message || "操作失败", icon: "none" });
		}
	} catch (err) {
		// 如果请求异常，回滚 UI
		detail.value.userLiked = originalLiked;
		detail.value.likeCount = originalCount;
		uni.showToast({ title: "点赞失败，请检查网络", icon: "none" });
	}
};

const recordView = (workerId) => {
	const userInfo = uni.getStorageSync('userinfo') || {};
	uniCloud.callFunction({
		name: 'recordHomepageView',
		data: {
			id: workerId,
			phoneNumber: userInfo.phoneNumber || '匿名用户'
		}
	}).then(res => {
		console.log('浏览记录成功', res);
	}).catch(err => {
		console.error('记录浏览失败', err);
	});
};

const handlePhoneCall = () => {
	const realPhone = detail.value?.phoneNumber;
	if (!realPhone) {
		return uni.showToast({ title: '电话号码未提供', icon: 'none' });
	}

	uni.showModal({
		title: '确认拨打',
		content: `确定拨打 ${maskedPhone.value} 吗？`,
		success: (res) => {
			if (res.confirm) {
				uni.makePhoneCall({
					phoneNumber: realPhone,
					success: () => {
						recordCallEvent();
					},
					fail: (err) => {
						console.log('拨打失败', err);
					}
				});
			}
		}
	});
};

const recordCallEvent = () => {
	const userInfo = uni.getStorageSync('userinfo') || {};
	uniCloud.callFunction({
		name: 'recordUserPhoneCallAction',
		data: {
			actionType: 'phone_call',
			targetId: id.value,
			targetPhoneNumber: detail.value.phoneNumber,
			callerPhoneNumber: userInfo.phoneNumber || '未登录用户'
		}
	}).then(() => {
		console.log('拨打事件已记录');
	}).catch((err) => {
		console.error('记录拨打行为失败', err);
	});
};

const handleStartChat = async () => {
	const userInfo = uni.getStorageSync('userinfo') || {};
	const userA_phone = userInfo.phoneNumber;
	const userB_phone = detail.value.phoneNumber;

	if (!userA_phone) {
		return uni.showToast({ title: '请先登录', icon: 'none' });
	}
	if (!userB_phone) {
		return uni.showToast({ title: '无效的聊天对象', icon: 'none' });
	}
	if (userA_phone === userB_phone) {
		return uni.showToast({ title: '不能和自己聊天', icon: 'none' });
	}

	uni.showLoading({ title: '正在创建会话...' });

	try {
		const res = await uniCloud.callFunction({
			name: 'createOrUpdateChatSession',
			data: {
				userAPhone: userA_phone,
				userBPhone: userB_phone
			}
		});

		uni.hideLoading();
		if (res.result.success && res.result.sessionId) {
			uni.navigateTo({
				url: `/pages/chatDetail/chatDetail?sessionId=${res.result.sessionId}`
			});
		} else {
			uni.showToast({ title: res.result.message || '会话创建失败', icon: 'none' });
		}
	} catch (err) {
		uni.hideLoading();
		console.error('ChatSession 创建失败', err);
		uni.showToast({ title: '会话创建出错，请重试', icon: 'none' });
	}
};

const handleAppointment = () => {
  const userInfo = uni.getStorageSync('userinfo');
  if (!userInfo || !userInfo._id) {
    uni.showToast({
      title: '请先登录再预约',
      icon: 'none'
    });
    return;
  }
  
  const userId = detail.value?.userId || '';
  const accountPhoneNumber = detail.value?.accountPhoneNumber || '';

  if (!userId || !accountPhoneNumber) {
    return uni.showToast({
      title: '预约信息不完整',
      icon: 'none'
    });
  }

  uni.navigateTo({
    url: `/pages/appointmentForm/appointmentForm?userId=${userId}&accountPhoneNumber=${accountPhoneNumber}`
  });
};

// --- 新增和修改的评论区方法 ---

// 切换回复列表的显示/隐藏
const toggleReplies = (commentId) => {
	if (replyState[commentId]) {
		replyState[commentId].showReplies = !replyState[commentId].showReplies;
	}
};

// 切换回复输入框的显示/隐藏
const toggleReplyInput = (commentId) => {
	const userInfo = uni.getStorageSync('userinfo');
	if (!userInfo || !userInfo._id) { // 检查 _id 是否存在
		uni.showToast({ title: '请先登录再回复', icon: 'none' });
		return;
	}
	if (replyState[commentId]) {
		replyState[commentId].showInput = !replyState[commentId].showInput;
	}
};

// 提交回复
// HomepageDetail.vue 中的 handleReplySubmit 完整版
// 假设在 HomepageDetail.vue 或 allComments.vue 中
const handleReplySubmit = async (commentId) => {
  const replyContent = replyState[commentId].content;
  if (!replyContent.trim()) {
    uni.showToast({ title: '回复内容不能为空', icon: 'none' });
    return;
  }

  // 从本地 storage 读取 userinfo
  const storageUser = uni.getStorageSync('userinfo');
  if (!storageUser || !storageUser._id) {
    uni.showToast({ title: '请先登录再回复', icon: 'none' });
    return;
  }

  // 只透传必要字段：_id, 昵称, 头像
  const caller = {
    _id: storageUser._id,
    nickname: storageUser.name || storageUser.nickname || '', // 优先用 name 或 nickname
    avatar: storageUser.avatar || ''                         // 本地存的 avatar 字段
  };

  uni.showLoading({ title: '正在提交...' });
  try {
    const res = await uniCloud.callFunction({
      name: 'addCommentReply',
      data: {
        homepageId: detail.value._id,  // 或 technicianId.value
        commentId,
        content: replyContent.trim(),
        userInfo: caller              // 透传 caller 对象
      }
    });
    uni.hideLoading();

    if (res.result.success) {
      uni.showToast({ title: '回复成功', icon: 'success' });
      // 重置输入框并刷新
      replyState[commentId].content = '';
      replyState[commentId].showInput = false;
      getDetail();      // 或 refreshComments()
    } else {
      uni.showToast({ title: res.result.message || '回复失败', icon: 'none' });
    }
  } catch (err) {
    uni.hideLoading();
    uni.showToast({ title: '回复失败，请重试', icon: 'none' });
    console.error('回复提交失败', err);
  }
};



// 跳转到全部评论页面
const navigateToAllComments = () => {
	uni.navigateTo({
		url: `/pages/allComments/allComments?technicianId=${detail.value._id}`
	});
};

</script>

<style lang="scss">
/* 原始 wxss 样式 */
.worker-detail {
	background: #f8f8f8;
	font-size: 28rpx;
	padding-bottom: 40rpx;

	.banner-swiper {
		width: 100%;
		height: 400rpx;
	}

	.banner-img {
		width: 100%;
		height: 100%;
	}

	.basic-info {
		display: flex;
		padding: 24rpx;
		background: #fff;
		position: relative;
		align-items: center;

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-right: 24rpx;
			flex-shrink: 0;
		}

		.info-text {
			flex: 1;

			.name {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 8rpx;
			}

			.tags,
			.area {
				color: #888;
				font-size: 26rpx;
				margin-bottom: 8rpx;
			}
		}

		.like-container {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(255, 255, 255, 0.9);
			padding: 10rpx 20rpx;
			border-radius: 30rpx;
			box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

			.like-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.like-count {
				font-size: 28rpx;
				color: #333;
			}
		}
	}

.section-title {
  position: relative;
  padding: 20rpx 20rpx 20rpx 20rpx; /* 左侧留出伪元素空间 */
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin: 20rpx 0 0 20rpx;
  background: #fff;
}

/* 新增伪元素来绘制圆润短蓝条 */
.section-title::before {
  content: '';
  position: absolute;
  left: 0rpx;      /* 与整体 left margin 对齐 */
  top: 50%;         /* 垂直居中 */
  transform: translateY(-50%);
  width: 8rpx;      /* 蓝条宽度 */
  height: 40rpx;    /* 蓝条高度 */
  background: #007aff;
  border-radius: 4rpx; /* 圆润效果 */
}

	.service-section,
	.desc-section,
	.comment-section,
	.media-section {
		background: #fff;
		margin-top: 20rpx;
		padding: 20rpx;
	}

	.service-section {
		.tag-list {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx 0 20rpx;

			.skill-tag {
				background: #f0f0f0;
				color: #555;
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				margin-right: 12rpx;
				margin-top: 12rpx;
				font-size: 26rpx;
			}
		}

		.price {
			padding-top: 10rpx;
			color: #e64a19;
			font-weight: bold;
		}
	}

	.desc-section {
		.desc-text {
			display: block;
			padding-top: 20rpx;
			font-size: 28rpx;
			line-height: 1.8;
			color: #444;
		}
	}

	.contact-section {
		margin: 40rpx 20rpx;
		display: flex;
		gap: 20rpx;
		justify-content: space-between;

		.call-btn,
		.start-chat-btn,
		.appointment-btn {
			background: linear-gradient(135deg, #007aff, #4db8ff);
			color: #fff;
			border-radius: 20rpx;
			font-size: 30rpx;
			height: 88rpx;
			line-height: 88rpx;
			flex: 1;
			margin: 0;
			padding: 0;
			border: none;

			&::after {
				border: none;
			}

			&:active {
				opacity: 0.8;
				transform: scale(0.98);
			}
		}
	}

	.media-section {
		.media-item {
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.media-img,
			.media-video {
				width: 100%;
				border-radius: 10rpx;
			}
		}
	}
}

.comment-rating {
	margin-top: 10rpx;
	margin-left: 76rpx;
	display: flex;
}

.star {
	font-size: 32rpx;
	color: #ccc;
}

.star.active {
	color: #ffc107;
}

.comment-images {
	margin-top: 10rpx;
	padding-left: 76rpx;
	display: flex;
	flex-wrap: wrap;
}

.comment-img {
	width: 120rpx;
	height: 120rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	border-radius: 10rpx;
}

.skeleton {
	.skeleton-title {
		height: 32rpx;
		background-color: #f2f3f5;
		margin-bottom: 20rpx;
		width: 40%;
	}

	.skeleton-row {
		height: 28rpx;
		background-color: #f2f3f5;
		margin-top: 15rpx;
	}
}

.comment-section {
	.comment-item {
		margin-top: 24rpx;
		border-bottom: 1rpx solid #eee;
		padding-bottom: 16rpx;
		&:last-child {
			border-bottom: none;
		}

		.comment-header {
			display: flex;
			align-items: center;

			.comment-avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			.comment-info {
				.comment-name {
					font-weight: bold;
					font-size: 28rpx;
				}

				.comment-date {
					font-size: 24rpx;
					color: #999;
				}
			}
		}

		.comment-content {
			margin-top: 16rpx;
			padding-left: 76rpx;
			font-size: 30rpx;
			color: #444;
		}

		.comment-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 16rpx;
			padding-right: 10rpx;
			.reply-btn {
				font-size: 24rpx;
				color: #007aff;
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
				background-color: #f0f5ff;
			}
		}

		.replies-wrapper {
			margin-top: 20rpx;
			margin-left: 76rpx;
			padding: 20rpx;
			background-color: #f7f7f7;
			border-radius: 10rpx;

			.reply-list {
				.reply-item {
					display: flex;
					margin-bottom: 16rpx;
					&:last-child {
						margin-bottom: 0;
					}

					.reply-avatar {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						margin-right: 16rpx;
						flex-shrink: 0;
					}

					.reply-content {
						flex: 1;
						.reply-header {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 8rpx;
							.reply-name {
								font-size: 26rpx;
								font-weight: bold;
								color: #333;
								margin-right: 20rpx; /* 增加姓名和日期间距 */
							}
							.reply-date {
								font-size: 24rpx;
								color: #999;
								margin-left: auto; /* 日期靠右对齐 */
							}
						}
						.reply-text {
							font-size: 26rpx;
							color: #555;
							word-break: break-all;
						}
					}
				}
			}

			.toggle-replies {
				font-size: 26rpx;
				color: #007aff;
				padding-top: 10rpx;
				margin-top: 10rpx;
				border-top: 1rpx solid #eee;
			}
		}

		.reply-input-area {
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			margin-left: 76rpx;

			.reply-input {
				flex: 1;
				background-color: #f2f2f2;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 28rpx;
				padding: 0 20rpx;
				border-radius: 30rpx;
			}
			.reply-submit-btn {
				margin-left: 20rpx;
				background-color: #007aff;
				color: #fff;
			}
		}
	}

	.toggle-more {
		text-align: center;
		font-size: 28rpx;
		color: #007aff;
		padding: 24rpx 0 10rpx;
	}
}

.reply-header {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.reply-date {
  font-size: 24rpx;
  color: #999;
}
</style>	