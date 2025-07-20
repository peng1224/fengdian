<template>
  <view class="page-container">

    <!-- 提现信息卡片 -->
    <view class="card balance-card">
      <view class="card-header">
        <text class="card-title">我的余额</text>
      </view>
      <view class="card-body">
        <view class="balance-row">
          <text class="balance-label">可提现金额:</text>
          <view class="balance-amount">
            <text class="currency-symbol">¥</text>
            <text class="amount">{{ availableBalance.toFixed(2) }}</text>
          </view>
        </view>
        <view class="balance-row">
          <text class="balance-label">提现审核中:</text>
          <view class="balance-amount">
            <text class="currency-symbol">¥</text>
            <text class="amount status-pending">{{ pendingWithdrawalAmount.toFixed(2) }}</text>
          </view>
        </view>
      </view>
      <view class="card-footer">
        <button class="btn primary-btn" @click="requestWithdrawal" :disabled="availableBalance <= 0 || isRequesting">
          {{ isRequesting ? '正在申请...' : '一键提现' }}
        </button>
      </view>
    </view>

    <!-- 提现历史记录 -->
    <view class="card history-card">
      <view class="card-header">
        <text class="card-title">提现记录</text>
      </view>
      <view class="card-body">
        <view v-if="historyLoading" class="loading-state">
          <text>加载中...</text>
        </view>
        <view v-else-if="withdrawalHistory.length === 0" class="empty-state">
          <text>暂无提现记录</text>
        </view>
        <view v-else class="history-list">
          <view v-for="record in withdrawalHistory" :key="record._id" class="history-item">
            <view class="item-info">
              <text class="item-amount">¥{{ record.amount.toFixed(2) }}</text>
              <text class="item-date">{{ formatTimestamp(record.requestAt) }}</text>
            </view>
            <view class="item-status" :class="getStatusClass(record.status)">
              {{ formatWithdrawalStatus(record.status) }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义消息提示框 -->
    <view class="custom-message-popup" :class="{ 'show': popupVisible, [popupMessageType]: true }">
      <text class="popup-text">{{ popupMessageText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const availableBalance = ref(0); // 可提现金额
const pendingWithdrawalAmount = ref(0); // 提现审核中的金额
const withdrawalHistory = ref([]); // 提现历史记录
const isRequesting = ref(false); // 提现请求中状态
const historyLoading = ref(true); // 历史记录加载状态

// 消息提示框相关
const popupVisible = ref(false);
const popupMessageType = ref('success'); // success, error, info
const popupMessageText = ref('');
let popupTimer = null; // 用于控制消息框自动隐藏的定时器

// 状态栏高度
const statusBarHeight = ref(0);

// 获取系统信息，用于计算状态栏高度
onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight;
    }
  });
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  // 使用 toLocaleString 格式化日期和时间，更符合本地习惯
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24小时制
  });
};

// 格式化提现状态
const formatWithdrawalStatus = (status) => {
  const map = {
    pending_review: '待审核',
    completed: '已打款',
    rejected: '已拒绝',
    failed: '打款失败'
  };
  return map[status] || '未知状态';
};

// 获取状态对应的CSS类
const getStatusClass = (status) => {
  switch (status) {
    case 'pending_review':
      return 'status-pending';
    case 'completed':
      return 'status-completed';
    case 'rejected':
    case 'failed':
      return 'status-failed';
    default:
      return '';
  }
};

// 显示消息提示
const showMessage = (type, text, duration = 2000) => {
  if (popupTimer) {
    clearTimeout(popupTimer);
  }
  popupMessageType.value = type;
  popupMessageText.value = text;
  popupVisible.value = true;
  popupTimer = setTimeout(() => {
    popupVisible.value = false;
    popupTimer = null;
  }, duration);
};

// 获取工人可提现金额和审核中金额
const fetchBalances = async () => {
  const userinfo = uni.getStorageSync('userinfo');
  if (!userinfo || !userinfo._id) {
    showMessage('error', '请先登录');
    return;
  }
  try {
    const res = await uniCloud.callFunction({
      name: 'getWorkerAvailableBalance',
      data: { userId: userinfo._id }
    });
    if (res.result && res.result.success) {
      availableBalance.value = res.result.availableBalance;
      pendingWithdrawalAmount.value = res.result.pendingWithdrawalAmount;
    } else {
      console.error('获取金额失败:', res.result.message);
      showMessage('error', res.result.message || '获取余额失败');
    }
  } catch (e) {
    console.error('调用云函数 getWorkerAvailableBalance 失败:', e);
    showMessage('error', '获取余额网络错误');
  }
};

// 获取提现历史记录
const fetchWithdrawalHistory = async () => {
  historyLoading.value = true;
  const userinfo = uni.getStorageSync('userinfo');
  if (!userinfo || !userinfo._id) {
    historyLoading.value = false;
    return;
  }
  try {
    const res = await uniCloud.callFunction({
      name: 'getWithdrawalHistory',
      data: { userId: userinfo._id }
    });
    if (res.result && res.result.success) {
      // 将提现金额从分转换为元
      withdrawalHistory.value = res.result.data.map(record => ({
        ...record,
        amount: record.amount / 100 // 假设数据库存储的是分
      }));
    } else {
      console.error('获取提现历史失败:', res.result.message);
      showMessage('error', res.result.message || '获取历史失败');
    }
  } catch (e) {
    console.error('调用云函数 getWithdrawalHistory 失败:', e);
    showMessage('error', '获取历史网络错误');
  } finally {
    historyLoading.value = false;
  }
};

// 申请提现 (一键提现所有可提现金额)
const requestWithdrawal = async () => {
  if (availableBalance.value <= 0) {
    showMessage('info', '当前无可提现金额');
    return;
  }

  const confirmRes = await uni.showModal({
    title: '确认提现',
    content: `您确定要提现所有可提现金额 ¥${availableBalance.value.toFixed(2)} 吗？`,
    confirmText: '确认提现',
    cancelText: '取消'
  });

  if (!confirmRes.confirm) {
    return;
  }

  isRequesting.value = true;
  uni.showLoading({ title: '正在提交提现申请...', mask: true });

  const userinfo = uni.getStorageSync('userinfo');
  if (!userinfo || !userinfo._id || !userinfo.phoneNumber) { 
    showMessage('error', '无法获取用户信息，请重新登录');
    isRequesting.value = false;
    uni.hideLoading();
    return;
  }

  try {
    const res = await uniCloud.callFunction({
      name: 'requestWorkerFullWithdrawal',
      data: {
        userId: userinfo._id,
        workerPhone: userinfo.phoneNumber,
      }
    });

    if (res.result && res.result.success) {
      showMessage('success', '提现申请已提交，请等待平台审核');
      // 刷新余额和历史记录
      fetchBalances(); // 获取两个余额
      fetchWithdrawalHistory();
    } else {
      console.error('提现申请失败:', res.result.message);
      showMessage('error', res.result.message || '提现申请失败');
    }
  } catch (e) {
    console.error('调用云函数 requestWorkerFullWithdrawal 失败:', e);
    showMessage('error', '提现网络错误，请重试');
  } finally {
    isRequesting.value = false;
    uni.hideLoading();
  }
};

// 页面加载和显示时刷新数据
onMounted(() => {
  fetchBalances(); // 获取两个余额
  fetchWithdrawalHistory();
});

onShow(() => {
  fetchBalances(); // 获取两个余额
  fetchWithdrawalHistory();
});
</script>

<style lang="scss">
.page-container {
  min-height: 100vh;
}


.card {
  background-color: #fff;
  margin: 35rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  overflow: hidden; // 确保圆角生效
}

.card-header {
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.card-body {
  padding: 30rpx;
}

.balance-card {
  .balance-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 15rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .balance-label {
    font-size: 28rpx;
    color: #666;
    flex-shrink: 0; /* 防止文字被压缩 */
  }
  .balance-amount {
    display: flex;
    align-items: baseline;
    margin-left: 20rpx; /* 与label的间距 */
    .currency-symbol {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-right: 8rpx;
    }
    .amount {
      font-size: 56rpx; /* 比总额稍小 */
      font-weight: bold;
      color: #007aff; /* 主题蓝 */
    }
    /* 修正：将 .pending-amount 直接作用于 .amount */
    &.status-pending { /* 使用更具体的选择器，确保只应用于审核中金额 */
      color: #ff9900; /* 审核中金额使用橙色 */
    }
  }
  .card-footer {
    padding: 20rpx 30rpx 30rpx;
    border-top: 1rpx solid #eee;
    text-align: center;
  }
  .primary-btn {
    background-color: #007aff; /* 主题蓝 */
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    padding: 20rpx 0;
    width: 80%;
    &:active {
      opacity: 0.8;
    }
    &[disabled] {
      background-color: #a0cfff; /* 禁用状态的蓝色 */
      color: #fff;
    }
  }
}

.history-card {
  .history-list {
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      &:last-child {
        border-bottom: none;
      }
      .item-info {
        display: flex;
        flex-direction: column;
        .item-amount {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        .item-date {
          font-size: 24rpx;
          color: #999;
          margin-top: 4rpx;
        }
      }
      .item-status {
        font-size: 28rpx;
        padding: 8rpx 16rpx;
        border-radius: 10rpx;
        font-weight: bold;
        &.status-pending { /* 提现记录中的“待审核” */
          color: #ff9900; /* 橙色 */
          background-color: #fff3e0;
        }
        &.status-completed {
          color: #007aff; /* 蓝色 */
          background-color: #e6f7ff;
        }
        &.status-rejected, /* 拒绝 */
        &.status-failed { /* 失败 */
          color: #ff4d4f; /* 红色 */
          background-color: #ffe6e6;
        }
      }
    }
  }
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}

/* 自定义消息提示框样式 */
.custom-message-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  text-align: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  &.success {
    background-color: rgba(40, 167, 69, 0.8); /* Green */
  }
  &.error {
    background-color: rgba(220, 53, 69, 0.8); /* Red */
  }
  &.info {
    background-color: rgba(23, 162, 184, 0.8); /* Blue-ish */
  }
}
</style>
