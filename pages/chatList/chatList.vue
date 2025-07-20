<template>
	<view class="header-emptybox">
		<text class="profile-title">消息</text>
	</view>
	<view class="chat-list-page">
		<view v-if="isLoading" class="skeleton-container">
			<view v-for="i in 3" :key="i" class="skeleton-item">
				<view class="skeleton-avatar"></view>
				<view class="skeleton-details">
					<view class="skeleton-line-long"></view>
					<view class="skeleton-line-short"></view>
				</view>
			</view>
		</view>

		<view class="chat-list" v-else-if="chatList.length > 0">
			<view
				v-for="item in chatList"
				:key="item.sessionId"
				class="chat-item"
				@click="goToChatDetail(item)"
			>
				<image
					class="avatar"
					:src="getAvatarSrc(item)"  mode="aspectFill"
					@error="handleAvatarError(item)"
				/>
				<view class="chat-details">
					<view class="header">
						<text class="nickname">{{ item.name }}</text>
						<text class="last-time">{{ formatTime(item.lastTime) }}</text>
					</view>
					<view class="footer">
						<text class="last-message">{{ item.lastMessage }}</text>
						<view class="badge" v-if="item.unread > 0">
							<text class="badge-text">{{ item.unread > 99 ? '99+' : item.unread }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<image src="/static/images/empty-chat.png" class="empty-icon" mode="widthFix" />
			<text class="empty-text">暂无会话消息</text>
			<text class="empty-tip">去和工人们打招呼吧</text>
		</view>
	</view>
</template>


// pages/chatList/chatList.vue
// chatList.vue
<script setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref } from 'vue';
import {
  onLoad,
  onShow,
  onHide,
  onUnload
} from '@dcloudio/uni-app';

const myPhoneNumber = ref('');
const chatList = ref([]);
const isLoading = ref(true);
const isFirstLoad = ref(true); // 新增：标记是否首次加载
const DEFAULT_AVATAR = '/static/images/avatar-placeholder.png';

let pollingTimer = null; // 全局轮询定时器

// --- 生命周期钩子 ---
onLoad(() => {
  const ui = uni.getStorageSync('userinfo');
  if (!ui?.phoneNumber) {
    isLoading.value = false;
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  myPhoneNumber.value = ui.phoneNumber;
});

onShow(() => {
  if (!myPhoneNumber.value) return;

  if (isFirstLoad.value) {
    // 首次加载，显示骨架屏
    isLoading.value = true;
    fetchChatList().then(() => {
      isLoading.value = false;
      isFirstLoad.value = false; // 加载完成后标记为非首次
    });
    fetchTotalUnreadCount();
  } else {
    // 轮询更新，不显示骨架屏
    fetchChatList();
    fetchTotalUnreadCount();
  }

  // 30秒轮询一次
  if (pollingTimer) clearInterval(pollingTimer);
  pollingTimer = setInterval(() => {
    fetchChatList();
    fetchTotalUnreadCount();
  }, 20000);
});

onHide(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
});

onUnload(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
});

const fetchChatList = async () => {
  if (!myPhoneNumber.value) return;

  try {
    const res = await uniCloud.callFunction({
      name: 'get-chat-list',
      data: { userPhoneNumber: myPhoneNumber.value }
    });
    if (res.result.success) {
      const newData = res.result.data.map(session => ({
        ...session,
        unread: session.unreadCount || 0
      }));
      // 增量更新 chatList
      newData.forEach(newItem => {
        const index = chatList.value.findIndex(item => item.sessionId === newItem.sessionId);
        if (index !== -1) {
          // 更新已有项
          chatList.value[index] = newItem;
        } else {
          // 添加新项
          chatList.value.push(newItem);
        }
      });
      // 删除不存在的项
      chatList.value = chatList.value.filter(item =>
        newData.some(newItem => newItem.sessionId === item.sessionId)
      );
    }
  } catch (e) {
    console.error('获取会话列表失败:', e);
  }
};

const fetchTotalUnreadCount = async () => {
  try {
    const res = await uniCloud.callFunction({
      name: 'get-total-unread-count',
      data: { userPhoneNumber: myPhoneNumber.value }
    });
    if (res.result.success) {
      const total = res.result.totalUnread || 0;
      if (total > 0) {
        uni.setTabBarBadge({
          index: 2,
          text: total > 99 ? '99+' : total.toString()
        });
      } else {
        uni.removeTabBarBadge({ index: 2 });
      }
    }
  } catch (e) {
    console.error('获取总未读数失败:', e);
  }
};

// 优化 getAvatarSrc 函数
const getAvatarSrc = (item) => {
    // 优先使用后端返回的头像URL
    // 如果没有或为空，则使用默认占位符
    return item.avatar || DEFAULT_AVATAR;
};

// handleAvatarError 函数，当头像加载失败时，显示默认占位符
const handleAvatarError = (item) => {
  // 确保 item.avatar 有效，防止循环错误
  if (item.avatar !== DEFAULT_AVATAR) {
    item.avatar = DEFAULT_AVATAR; // 将错误的头像URL替换为默认占位符
  }
  console.error('头像加载失败:', item.avatar);
};

const goToChatDetail = (item) => {
	uni.navigateTo({
		url: `/pages/chatDetail/chatDetail?sessionId=${item.sessionId}&name=${encodeURIComponent(item.name)}`
	});
};

const formatTime = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  if (date >= startOfToday) {
    return date.toTimeString().slice(0, 5);
  } else if (date >= startOfYesterday) {
    return '昨天';
  } else {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}/${m}/${d}`;
  }
};


onShareAppMessage(() => {
  return {
    title: '蜂点到家 - 本地靠谱的家政技工平台',
    path: '/pages/index/index'
  }
})

onShareTimeline(() => {
  return {
    title: '蜂点到家 - 快速预约本地服务'
  }
})
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.header-emptybox {
	width: 100%;
	height: 230rpx;
	position: relative;
}
.profile-title {
	position: absolute;
	font-size: 55rpx;
	font-weight: 580;
	color: #1c1c1e;
	font-family: "Helvetica Neue", "PingFang SC", "Helvetica", "Arial", sans-serif;
	top: 130rpx;
	left: 35rpx;
}

.chat-list-page {
	background-color: #ffffff;
	min-height: 100vh;
}

.chat-list {
	padding: 0 30rpx;
}

.chat-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	transition: background-color 0.2s;
	&:last-child {
		border-bottom: none;
	}
	&:active {
		background-color: #f5f5f5;
	}
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 24rpx;
	flex-shrink: 0;
	background-color: #eee;
}

.chat-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.nickname {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
}

.last-time {
	font-size: 24rpx;
	color: #999;
	flex-shrink: 0;
}

.footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}

.last-message {
	flex: 1;
	font-size: 28rpx;
	color: #888;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.badge {
	background-color: #fa3534;
	border-radius: 999rpx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0 12rpx;
	height: 36rpx;
	min-width: 36rpx;
	flex-shrink: 0;
	box-sizing: border-box;
	animation: pulse 1.5s infinite;
	box-shadow: 0 4rpx 8rpx rgba(250, 53, 52, 0.3);
	margin-bottom: 5rpx;
}

.badge-text {
	font-size: 24rpx;
	color: #ffffff;
	font-weight: bold;
	line-height: 1;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 280rpx;
	.empty-icon {
		width: 300rpx;
	}
	.empty-text {
		font-size: 30rpx;
		color: #333;
		margin-top: 30rpx;
	}
	.empty-tip {
		font-size: 26rpx;
		color: #999;
		margin-top: 15rpx;
	}
}

.skeleton-container {
	padding: 0 30rpx;
}
.skeleton-item {
	display: flex;
	align-items: center;
	padding: 40rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}
.skeleton-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background-color: #E0E0E0;
	margin-right: 24rpx;
	animation: skeleton-shimmer 1.5s infinite ease-in-out;
}
.skeleton-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100rpx;
}
.skeleton-line-long {
	width: 80%;
	height: 36rpx;
	background-color: #E0E0E0;
	border-radius: 8rpx;
	animation: skeleton-shimmer 1.5s infinite ease-in-out;
}
.skeleton-line-short {
	width: 50%;
	height: 28rpx;
	background-color: #E0E0E0;
	border-radius: 8rpx;
	animation: skeleton-shimmer 1.5s infinite ease-in-out;
}

@keyframes skeleton-shimmer {
	0% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0.5;
	}
}
</style>