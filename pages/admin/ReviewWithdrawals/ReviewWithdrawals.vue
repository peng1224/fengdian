<template>
  <view class="page-container">
    <!-- 顶部导航栏将由 pages.json 配置和原生实现 -->

    <!-- 提现申请列表 -->
    <view class="card application-list-card">
      <view class="card-header">
        <text class="card-title">待审核申请</text>
      </view>
      <view class="card-body">
        <view v-if="loading" class="loading-state">
          <text>加载中...</text>
        </view>
        <view v-else-if="withdrawalRequests.length === 0" class="empty-state">
          <text>暂无待审核提现申请</text>
        </view>
        <view v-else class="application-list">
          <view v-for="request in withdrawalRequests" :key="request._id" class="application-item" @click="openReviewModal(request)">
            <view class="item-info">
              <text class="item-worker-name">工人: {{ request.workerName }} ({{ request.workerPhone }})</text>
              <text class="item-amount">提现金额: ¥{{ (request.amount / 100).toFixed(2) }}</text>
              <text class="item-date">申请时间: {{ formatTimestamp(request.requestAt) }}</text>
            </view>
            <view class="item-status status-pending-review">
              {{ formatWithdrawalStatus(request.status) }}
            </view>
            <text class="arrow-icon">›</text> <!-- 替换 uni-icons -->
          </view>
        </view>
      </view>
    </view>

    <!-- 提现详情审核弹窗 -->
    <view v-if="showReviewModal" class="popup-overlay" @click="closeReviewModal">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">提现详情</text>
          <text class="popup-close" @click="closeReviewModal">×</text>
        </view>
        <view class="popup-body" v-if="selectedRequest">
          <view class="detail-row">
            <text class="detail-label">工人姓名:</text>
            <text class="detail-value">{{ selectedRequest.workerName }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">工人电话:</text>
            <text class="detail-value">{{ selectedRequest.workerPhone }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">提现金额:</text>
            <text class="detail-value amount-value">¥{{ (selectedRequest.amount / 100).toFixed(2) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">申请时间:</text>
            <text class="detail-value">{{ formatTimestamp(selectedRequest.requestAt) }}</text>
          </view>
          <!-- 微信收款信息 -->
          <view class="detail-row">
            <text class="detail-label">微信号:</text>
            <text class="detail-value">{{ selectedRequest.weChatId || '未设置' }}</text>
          </view>
          <view class="detail-row qr-code-row">
            <text class="detail-label">收款码:</text>
            <view class="detail-value qr-code-wrapper">
              <!-- 添加点击预览功能 -->
              <image 
                v-if="selectedRequest.weChatQrCodeUrl" 
                :src="selectedRequest.weChatQrCodeUrl" 
                mode="aspectFit" 
                class="wechat-qr-code-img" 
                @error="onQrCodeError"
                @click="previewQrCode(selectedRequest.weChatQrCodeUrl)" 
              />
              <text v-else class="no-qr-code">未上传收款码</text>
            </view>
          </view>
          <!-- 关联收入ID可以保留，方便审计 -->
          <view class="detail-row">
            <text class="detail-label">关联收入ID:</text>
            <view class="detail-value related-ids">
              <text v-for="id in selectedRequest.relatedSettlementIds" :key="id" class="id-tag">{{ id }}</text>
              <text v-if="!selectedRequest.relatedSettlementIds || selectedRequest.relatedSettlementIds.length === 0">无</text>
            </view>
          </view>
          <view class="detail-row">
            <text class="detail-label">管理员备注:</text>
            <textarea v-model="adminRemarks" placeholder="请输入备注（可选）" class="remarks-input" auto-height></textarea>
          </view>
        </view>
        <view class="popup-actions">
          <!-- 重新加入拒绝提现按钮 -->
          <button class="btn reject-btn" @click="processWithdrawal('rejected')">拒绝提现</button>
          <button class="btn approve-btn" @click="processWithdrawal('completed')">批准打款</button>
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

const loading = ref(true);
const withdrawalRequests = ref([]); // 待审核的提现申请列表

const showReviewModal = ref(false); // 控制详情弹窗显示
const selectedRequest = ref(null); // 当前选中的提现申请详情
const adminRemarks = ref(''); // 管理员备注

// 消息提示框相关
const popupVisible = ref(false);
const popupMessageType = ref('success'); // success, error, info
const popupMessageText = ref('');
let popupTimer = null;

onMounted(() => {
  fetchWithdrawalRequests();
});

onShow(() => {
  fetchWithdrawalRequests(); // 页面显示时刷新数据
});

const goBack = () => {
  uni.navigateBack();
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24小时制
  });
};

const formatWithdrawalStatus = (status) => {
  const map = {
    pending_review: '待审核',
    completed: '已打款',
    rejected: '已拒绝',
    failed: '打款失败'
  };
  return map[status] || '未知状态';
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending_review':
      return 'status-pending-review';
    case 'completed':
      return 'status-completed';
    case 'rejected':
    case 'failed':
      return 'status-failed';
    default:
      return '';
  }
};

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

// 获取待审核的提现申请列表
const fetchWithdrawalRequests = async () => {
  loading.value = true;
  try {
    const res = await uniCloud.callFunction({
      name: 'getAdminWithdrawalRequests', 
      data: {} 
    });
    if (res.result && res.result.success) {
      withdrawalRequests.value = res.result.data;
    } else {
      console.error('获取提现申请失败:', res.result.message);
      showMessage('error', res.result.message || '获取申请失败');
    }
  } catch (e) {
    console.error('调用云函数 getAdminWithdrawalRequests 失败:', e);
    showMessage('error', '获取申请网络错误');
  } finally {
    loading.value = false;
  }
};

// 打开审核弹窗
const openReviewModal = (request) => {
  selectedRequest.value = request;
  adminRemarks.value = ''; // 清空备注
  showReviewModal.value = true;
};

// 关闭审核弹窗
const closeReviewModal = () => {
  showReviewModal.value = false;
  selectedRequest.value = null;
};

// 图片加载失败处理
const onQrCodeError = (e) => {
  console.error('收款码图片加载失败:', e.detail.errMsg);
  if (selectedRequest.value) {
    showMessage('info', '收款码图片加载失败，请联系工人核实');
  }
};

// 预览收款码图片
const previewQrCode = (url) => {
  if (url) {
    uni.previewImage({
      urls: [url], 
      current: url 
    });
  } else {
    uni.showToast({ title: '无收款码可预览', icon: 'none' });
  }
};


// 处理提现申请 (批准打款或拒绝提现)
const processWithdrawal = async (newStatus) => {
  if (!selectedRequest.value) return;

  const actionText = newStatus === 'completed' ? '批准打款' : '拒绝提现';
  const confirmContent = newStatus === 'completed' 
    ? `确定要批准工人 ${selectedRequest.value.workerPhone} 提现 ¥${(selectedRequest.value.amount / 100).toFixed(2)} 吗？`
    : `确定要拒绝工人 ${selectedRequest.value.workerPhone} 的提现申请吗？`; // 拒绝时也显示确认信息
  
  const confirmRes = await uni.showModal({
    title: `确认${actionText}`,
    content: confirmContent,
    confirmText: actionText,
    cancelText: '取消'
  });

  if (!confirmRes.confirm) {
    return;
  }

  uni.showLoading({ title: `正在${actionText}...`, mask: true });

  const adminInfo = uni.getStorageSync('userinfo');
  const adminId = adminInfo ? adminInfo._id : 'unknown_admin';

  try {
    const res = await uniCloud.callFunction({
      name: 'updateWithdrawalStatusByAdmin', 
      data: {
        withdrawalRequestId: selectedRequest.value._id,
        newStatus: newStatus, 
        adminId: adminId,
        remarks: adminRemarks.value 
      }
    });

    if (res.result && res.result.success) {
      // 根据操作类型显示不同的成功消息
      if (newStatus === 'completed') {
        showMessage('success', `${actionText}成功！请立即进行微信转账。`); 
      } else {
        showMessage('success', `${actionText}成功！`);
      }
      closeReviewModal();
      fetchWithdrawalRequests(); // 刷新列表
    } else {
      console.error(`${actionText}失败:`, res.result.message);
      showMessage('error', res.result.message || `${actionText}失败`);
    }
  } catch (e) {
    console.error(`调用云函数 updateWithdrawalStatusByAdmin 失败:`, e);
    showMessage('error', `${actionText}网络错误，请重试`);
  } finally {
    uni.hideLoading();
  }
};
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
  overflow: hidden;
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

.application-list {
  .application-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
    &:active {
      background-color: #f8f8f8;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      .item-worker-name, .item-amount {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 4rpx;
      }
      .item-amount {
        color: #007aff; /* 提现金额用蓝色 */
      }
      .item-date {
        font-size: 24rpx;
        color: #999;
      }
    }
    .item-status {
      font-size: 28rpx;
      padding: 8rpx 16rpx;
      border-radius: 10rpx;
      font-weight: bold;
      margin-left: 20rpx;
      flex-shrink: 0; /* 防止状态文本被压缩 */

      &.status-pending-review {
        color: #ff9900; /* 橙色 */
        background-color: #fff3e0;
      }
    }
    .arrow-icon {
      margin-left: 20rpx;
      flex-shrink: 0;
      font-size: 24px; /* 调整大小 */
      color: #c0c4cc; /* 颜色 */
    }
  }
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}

/* 弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: #fff;
  padding: 30rpx;
  width: 85%;
  max-width: 600rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.popup-body {
  margin-bottom: 40rpx;
}

.detail-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 20rpx;
  .detail-label {
    font-size: 28rpx;
    color: #666;
    flex-shrink: 0;
    margin-right: 20rpx;
  }
  .detail-value {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    flex: 1;
    word-break: break-all; /* 允许长ID换行 */
  }
  .amount-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #007aff;
  }
  .related-ids {
    display: flex;
    flex-wrap: wrap;
    .id-tag {
      background-color: #f0f0f0;
      border-radius: 8rpx;
      padding: 4rpx 12rpx;
      margin: 4rpx 8rpx 4rpx 0;
      font-size: 22rpx;
      color: #666;
    }
  }
}

.qr-code-row {
  align-items: flex-start; /* QR码行顶部对齐 */
}

.qr-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200rpx; /* 固定宽度 */
  height: 200rpx; /* 固定高度 */
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f9f9f9;
  .wechat-qr-code-img {
    width: 100%;
    height: 100%;
  }
  .no-qr-code {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    padding: 10rpx;
  }
}

.remarks-input {
  width: calc(100% - 20rpx); /* 减去padding */
  min-height: 120rpx;
  padding: 10rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  margin-top: 10rpx;
  box-sizing: border-box; /* 确保padding不增加宽度 */
}

.popup-actions {
  display: flex;
  justify-content: center; /* 居中显示按钮 */
  gap: 20rpx; /* 按钮间距 */
}

.btn {
  flex: 1; /* 按钮占据可用空间 */
  max-width: 300rpx; /* 限制最大宽度 */
  padding: 20rpx 0;
  font-size: 32rpx;
  border-radius: 50rpx;
  border: none;
  color: #fff;
  &:active {
    opacity: 0.8;
  }
}

.approve-btn {
  background-color: #007aff; /* 主题蓝 */
}

.reject-btn { /* 新增拒绝按钮样式 */
  background-color: #ff3b30; /* 红色 */
}

/* 自定义消息提示框样式 (复用 payouts.vue 的样式) */
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
