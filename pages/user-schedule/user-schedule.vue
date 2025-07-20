<template>
  <view class="page-container">
    <view v-if="loading" class="feedback-view">
      <view class="loading-indicator">加载中...</view>
    </view>
    <view v-else-if="appointments.length === 0" class="feedback-view">
      <view class="empty-message">暂无预约记录</view>
    </view>

    <view v-else class="appointment-list">
      <view
        class="appointment-card"
        v-for="item in appointments"
        :key="item._id"
      >
        <view class="card-body">
          <view class="info-row">
            <text class="label">服务时间</text>
            <text class="value">{{ item.serviceDate }} {{ item.serviceHour }}</text>
          </view>
          <view class="info-row">
            <text class="label">师傅电话</text>
            <text class="value">{{ item.workerPhone }}</text>
          </view>
          <view class="info-row" v-if="item.remark">
            <text class="label">备注信息</text>
            <text class="value">{{ item.remark }}</text>
          </view>
          <view class="info-row">
            <text class="label">服务状态</text>
            <text class="value status-text" :class="`status-${item.status}`">{{ translateStatus(item.status) }}</text>
          </view>
          <view class="info-row" v-if="item.review && item.review.comment">
            <text class="label">我的评价</text>
            <text class="value review-comment">{{ item.review.comment }}</text>
          </view>
        </view>
        
        <view class="card-footer">
          <!-- 动态绑定类名，根据按钮数量调整布局 -->
          <view class="button-group" :class="getButtonGroupClass(item)">
            <!-- 场景1: 预约成功，服务时间未到 (取消 + 完成) -->
            <template v-if="item.status === 'confirmed' && item.expectedEndTime && item.expectedEndTime > Date.now()">
              <button class="btn cancel" @click="cancelAppointment(item)">取消预约</button>
              <button class="btn finish" @click="completeAppointment(item)">完成服务</button>
            </template>

            <!-- 场景2: 预约成功，服务时间已过但未自动完成 (联系客服 + 完成服务) -->
            <template v-else-if="item.status === 'confirmed' && item.expectedEndTime && item.expectedEndTime <= Date.now()">
              <button class="btn contact" @click="contactCustomerService">联系客服</button>
              <button class="btn finish" @click="completeAppointment(item)">完成服务</button>
            </template>

            <!-- 场景3: 已完成，未评价 (联系客服 + 评价服务) -->
            <template v-else-if="item.status === 'completed' && !item.review">
              <button class="btn contact" @click="contactCustomerService">联系客服</button>
              <button class="btn review" @click="openReviewModal(item)">评价服务</button>
            </template>

            <!-- 场景4: 已完成，已评价 (仅 联系客服) -->
            <template v-else-if="item.status === 'completed' && item.review">
              <button class="btn contact" @click="contactCustomerService">联系客服</button>
            </template>

            <!-- 场景5: 已取消，有退款信息 (仅 查看退款详情) -->
            <template v-else-if="item.status.startsWith('cancelled') && item.refundInfo">
              <button class="btn detail" @click="viewRefundDetail(item)">查看退款详情</button>
            </template>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 评价模态框 (保持不变) -->
    <view class="modal-overlay" v-if="reviewModalVisible" @click="closeReviewModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">服务评价</text>
          <text class="modal-close" @click="closeReviewModal">×</text>
        </view>
        <view class="modal-body">
          <view class="rating-section">
            <view class="stars">
              <text 
                v-for="star in 5" 
                :key="star" 
                class="star" 
                :class="{ 'active': star <= reviewForm.rating }" 
                @click="setRating(star)"
              >★</text>
            </view>
          </view>

          <view class="comment-section">
             <textarea 
               v-model="reviewForm.comment" 
               placeholder="服务满足您的期望吗？分享您的使用体验吧～" 
               class="comment-textarea"
               maxlength="200"
             ></textarea>
          </view>

          <view class="image-section">
            <view class="image-uploader">
              <view class="image-preview" v-for="(image, index) in reviewForm.images" :key="index">
                <image :src="image" mode="aspectFill"></image>
                <view class="remove-image" @click="removeImage(index)">×</view>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="reviewForm.images.length < 3">
                <text>+</text>
              </view>
            </view>
            <text class="image-tip">最多上传3张图片</text>
          </view>

          <view class="anonymous-section">
            <checkbox-group @change="toggleAnonymous">
              <label>
                <checkbox :checked="reviewForm.anonymous" /> 匿名评价
              </label>
            </checkbox-group>
          </view>
        </view>
        <view class="modal-footer">
          <button class="submit-review-btn" @click="submitReview">提交评价</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const appointments = ref([])
const loading = ref(true)

// --- 评价模态框相关状态 ---
const reviewModalVisible = ref(false)
const selectedAppointment = ref(null)
const reviewForm = reactive({
    rating: 5, // 默认5星好评
    comment: '',
    images: [], // 本地临时路径
    imageUrls: [], // 上传后的云存储路径
    anonymous: false // 新增匿名选项，默认不匿名
})

// --- 客服联系方式配置 ---
const CUSTOMER_SERVICE_CONTACTS = {
    phone: '19357501597', // 您的客服电话
    wechat: 'Chen_100peng', // 您的客服微信号
    qq: '3327261595' // 您的客服QQ号
};


function translateStatus(status) {
    const map = {
        confirmed: '预约成功',
        cancelled_by_worker: '师傅已取消',
        cancelled_by_user: '用户已取消',
        completed: '已完成'
    }
    return map[status] || status
}

async function fetchAppointments() {
    loading.value = true
    const userinfo = uni.getStorageSync('userinfo')
    if (!userinfo || !userinfo._id) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        loading.value = false
        return
    }
    try {
        const res = await uniCloud.callFunction({
            name: 'getUserAppointments',
            data: { userId: userinfo._id }
        })
        if (res.result.success) {
            appointments.value = res.result.data
            console.log('获取到的预约数据:', appointments.value);
        } else {
            console.error('云函数返回错误', res.result.message)
        }
    } catch (e) {
        console.error('调用云函数失败', e)
    } finally {
        loading.value = false
    }
}

// 【修改】联系客服方法：弹出选择框
const contactCustomerService = () => {
    uni.showActionSheet({
        itemList: ['拨打电话', '复制微信号', '复制QQ号'],
        success: (res) => {
            if (res.tapIndex === 0) { // 拨打电话
                uni.makePhoneCall({
                    phoneNumber: CUSTOMER_SERVICE_CONTACTS.phone
                });
            } else if (res.tapIndex === 1) { // 复制微信号
                // 使用 uni.setClipboardData 替代 document.execCommand('copy') 以提高兼容性
                uni.setClipboardData({
                    data: CUSTOMER_SERVICE_CONTACTS.wechat,
                    success: () => {
                        uni.showToast({
                            title: '微信号已复制',
                            icon: 'success'
                        });
                    },
                    fail: (err) => {
                        console.error('复制微信号失败:', err);
                        uni.showToast({
                            title: '复制失败，请手动复制',
                            icon: 'none'
                        });
                    }
                });
            } else if (res.tapIndex === 2) { // 复制QQ号
                // 使用 uni.setClipboardData 替代 document.execCommand('copy') 以提高兼容性
                uni.setClipboardData({
                    data: CUSTOMER_SERVICE_CONTACTS.qq,
                    success: () => {
                        uni.showToast({
                            title: 'QQ号已复制',
                            icon: 'success'
                        });
                    },
                    fail: (err) => {
                        console.error('复制QQ号失败:', err);
                        uni.showToast({
                            title: '复制失败，请手动复制',
                            icon: 'none'
                        });
                    }
                });
            }
        },
        fail: (res) => {
            console.log('用户取消选择', res.errMsg);
        }
    });
};

// 【新增】根据按钮数量动态返回类名 (保持不变)
const getButtonGroupClass = (item) => {
  let buttonCount = 0;
  // 场景1: 预约成功，服务时间未到 (取消 + 完成)
  if (item.status === 'confirmed' && item.expectedEndTime && item.expectedEndTime > Date.now()) {
    buttonCount = 2;
  }
  // 场景2: 预约成功，服务时间已过但未自动完成 (联系客服 + 完成服务)
  else if (item.status === 'confirmed' && item.expectedEndTime && item.expectedEndTime <= Date.now()) {
    buttonCount = 2;
  }
  // 场景3: 已完成，未评价 (联系客服 + 评价服务)
  else if (item.status === 'completed' && !item.review) {
    buttonCount = 2;
  }
  // 场景4: 已完成，已评价 (仅 联系客服)
  else if (item.status === 'completed' && item.review) {
    buttonCount = 1;
  }
  // 场景5: 已取消，有退款信息 (仅 查看退款详情)
  else if (item.status.startsWith('cancelled') && item.refundInfo) {
    buttonCount = 1;
  }

  return {
    'justify-two-buttons': buttonCount === 2,
    'justify-one-button': buttonCount === 1,
  };
};


// 查看退款详情方法 (保持不变)
const viewRefundDetail = (appointmentItem) => {
    let refundMessage = `总金额: ¥${(appointmentItem.total_fee / 100).toFixed(2)}\n`;
    if (appointmentItem.refundInfo) {
        refundMessage += `用户退款: ¥${(appointmentItem.refundInfo.userRefundAmount / 100).toFixed(2)}\n`;
        refundMessage += `师傅补偿: ¥${(appointmentItem.refundInfo.workerCompensation / 100).toFixed(2)}\n`;
        refundMessage += `平台扣费: ¥${(appointmentItem.refundInfo.platformFee / 100).toFixed(2)}\n`;
        if (appointmentItem.refundInfo.refundNo) {
             refundMessage += `退款单号: ${appointmentItem.refundInfo.refundNo}\n`;
        }
        if (appointmentItem.refundInfo.refundAt) {
            const refundDate = new Date(appointmentItem.refundInfo.refundAt);
            refundMessage += `退款时间: ${refundDate.toLocaleString()}\n`;
        }
    } else {
        refundMessage += '无详细退款信息。';
    }
    uni.showModal({
        title: '退款详情',
        content: refundMessage,
        showCancel: false,
        confirmText: '确定'
    });
};


async function cancelAppointment(appointmentItem) {
    // 前端再次校验，避免按钮未禁用但用户点击了
    // 只有状态为 'confirmed' 且预计结束时间未到才能取消
    if (appointmentItem.status !== 'confirmed' || !appointmentItem.expectedEndTime || appointmentItem.expectedEndTime <= Date.now()) {
        uni.showToast({ title: '该预约无法取消', icon: 'none' });
        // 这里可以根据情况引导联系客服，但由于按钮已经根据逻辑显示，这里不再重复弹窗
        return;
    }

    const res = await uni.showModal({
        title: '确认取消预约？',
        editable: true,
        placeholderText: '请输入取消原因（必填）',
        confirmText: '确认取消',
        cancelText: '点错了'
    });

    if (res.confirm) {
        const reason = res.content;
        
        if (!reason || !reason.trim()) {
            uni.showToast({ title: '必须填写取消原因', icon: 'none' });
            return;
        }

        uni.showLoading({ title: '正在取消...' });

        try {
            const userinfo = uni.getStorageSync('userinfo');
            if (!userinfo || !userinfo._id) {
                throw new Error('无法获取用户信息，请重新登录');
            }
            
            const dataToSend = {
                appointmentId: appointmentItem._id,
                cancellationReason: reason,
                userId: userinfo._id
            };
            console.log('即将发送给 cancelAppointmentByUser 云函数的参数:', dataToSend);

            const result = await uniCloud.callFunction({
                name: 'cancelAppointmentByUser',
                data: dataToSend
            });

            if (result.result.success) {
                uni.showToast({ title: '取消成功', icon: 'success' });
                fetchAppointments();
            } else {
                throw new Error(result.result.message || '取消失败');
            }
        } catch (error) {
            uni.showToast({ title: error.message, icon: 'none' });
        } finally {
            uni.hideLoading();
        }
    }
}

async function completeAppointment(appointmentItem) {
    const res = await uni.showModal({
        title: '确认完成服务？',
        content: '完成后可选择评价',
    })
    if (!res.confirm) return

    uni.showLoading({ title: '请稍候...' })
    try {
        const res = await uniCloud.callFunction({
            name: 'updateAppointmentStatusByuser',
            data: {
                appointmentId: appointmentItem._id,
                status: 'completed'
            }
        })
        if (res.result.success) {
            uni.showToast({ title: '服务已完成', icon: 'success' })
            fetchAppointments()
        } else {
            uni.showToast({ title: '操作失败', icon: 'none' })
        }
    } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
    } finally {
        uni.hideLoading()
    }
}

// --- 评价模态框方法 (保持不变) ---
function openReviewModal(appointmentItem) {
    selectedAppointment.value = appointmentItem
    reviewForm.rating = 5
    reviewForm.comment = ''
    reviewForm.images = []
    reviewForm.imageUrls = []
    reviewForm.anonymous = false
    reviewModalVisible.value = true
}

function closeReviewModal() {
    reviewModalVisible.value = false
}

function setRating(star) {
    reviewForm.rating = star
}

async function chooseImage() {
    try {
        const res = await uni.chooseImage({
            count: 3 - reviewForm.images.length,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
        })
        reviewForm.images.push(...res.tempFilePaths)
    } catch (e) {
        // 用户取消选择
    }
}

function removeImage(index) {
    reviewForm.images.splice(index, 1)
}

function toggleAnonymous(e) {
    reviewForm.anonymous = e.detail.value.length > 0
}

async function submitReview() {
    uni.showLoading({ title: '正在提交...' })

    const userinfo = uni.getStorageSync('userinfo')
    let reviewerName = ''
    let reviewerAvatar = '/static/images/avatar-placeholder.png'
    if (!reviewForm.anonymous && userinfo) {
        if (userinfo.name) reviewerName = userinfo.name
        if (userinfo.avatar) reviewerAvatar = userinfo.avatar
    }

    try {
        for (const imagePath of reviewForm.images) {
            const uploadResult = await uniCloud.uploadFile({
                filePath: imagePath,
                cloudPath: `review-images/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`,
                cloudPathAsRealPath: true,
            })
            reviewForm.imageUrls.push(uploadResult.fileID)
        }
    } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '图片上传失败', icon: 'none' })
        return
    }

    try {
        const res = await uniCloud.callFunction({
            name: 'submitReview',
            data: {
                appointmentId: selectedAppointment.value._id,
                workerPhone: selectedAppointment.value.workerPhone,
                reviewData: {
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                    images: reviewForm.imageUrls,
                    name: reviewerName,
                    avatar: reviewerAvatar
                }
            }
        })
        uni.hideLoading()
        if (res.result.success) {
            uni.showToast({ title: '评价成功', icon: 'success' })
            closeReviewModal()
            fetchAppointments()
        } else {
            uni.showToast({ title: res.result.message || '提交失败', icon: 'none' })
        }
    } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    }
}

onShow(fetchAppointments)
</script>

<style scoped>
/* 全局页面容器 */
.page-container {
  background-color: #f2f2f7;
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
}

/* 加载 & 空白 提示 */
.feedback-view {
  display: flex;
  flex-direction: column; /* 调整为列方向 */
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #8e8e93;
  font-size: 32rpx;
}

/* 列表容器 */
.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 20rpx;
}

/* 卡片容器 */
.appointment-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.appointment-card:active {
  transform: scale(0.99);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 卡片内容 */
.card-body {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 信息行 */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 28rpx;
  line-height: 1.4;
}

.info-row .label {
  color: #8e8e93;
  width: 160rpx;
  flex-shrink: 0;
}

.info-row .value {
  color: #1c1c1e;
  text-align: right;
  flex: 1;
  word-break: break-all;
}

/* 状态文字 */
.status-text {
  font-weight: 500;
}
.status-text.status-confirmed {
  color: #007aff;
}
.status-text.status-completed {
  color: #34c759;
}
.status-text.status-cancelled_by_worker,
.status-text.status-cancelled_by_user {
  color: #ff3b30;
}

/* 卡片底部按钮区域 */
.card-footer {
  border-top: 1rpx solid #e5e5e5;
  padding: 20rpx 32rpx;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 20rpx; /* 按钮间距 */
  /* 动态类将控制 justify-content */
}

.button-group.justify-two-buttons {
  justify-content: space-between; /* 两个按钮时左右对齐 */
}

.button-group.justify-one-button {
  justify-content: flex-end; /* 一个按钮时右对齐 */
}


.button-group .btn {
  flex: 1; /* 允许按钮平均分配空间并填充 */
  max-width: 280rpx; /* 限制按钮的最大宽度，防止过宽 */
  padding: 30rpx 0; /* 垂直内边距增至 30rpx */
  font-size: 26rpx;
  border-radius: 40rpx;
  line-height: 1;
  text-align: center;
  transition: background-color 0.2s, transform 0.2s, opacity 0.2s;
}

.button-group .btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.button-group .cancel {
  background-color: #fff;
  color: #ff3b30;
  border: 1rpx solid #ff3b30;
}

.button-group .finish {
  background-color: #34c759;
  color: #fff;
  border: 1rpx solid #34c759;
}

.button-group .review {
  background-color: #007aff;
  color: #fff;
  border: 1rpx solid #007aff;
}

.button-group .contact { /* 联系客服按钮样式 */
  background-color: #fff; /* 调整为白色背景 */
  color: #007aff; /* 蓝色文字 */
  border: 1rpx solid #007aff; /* 蓝色边框 */
}

.button-group .detail { /* 查看退款详情按钮样式 */
  background-color: #e0e0e0;
  color: #333;
  border: 1rpx solid #e0e0e0;
}


/* 评价模态框背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 评价模态框主体 */
.modal-content {
  width: 90%;
  max-width: 680rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
}

/* 模态框顶部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.modal-header .modal-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1c1c1e;
}
.modal-header .modal-close {
  font-size: 40rpx;
  color: #8e8e93;
}

/* 模态框内容 */
.modal-body {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

/* 刻度星星区域 */
.stars {
  display: flex;
  justify-content: center;
  gap: 20rpx;
}
.stars .star {
  font-size: 60rpx;
  color: #e0e0e0;
  transition: color 0.2s, transform 0.2s;
}
.stars .star.active {
  color: #ffc107;
}
.stars .star:active {
  transform: scale(1.2);
}

/* 评论文本框 */
.comment-textarea {
  width: 100%;
  height: 180rpx;
  padding: 20rpx;
  background-color: #f2f2f7;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #1c1c1e;
  box-sizing: border-box;
}

/* 图片上传区域 */
.image-uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.image-uploader .upload-btn,
.image-uploader .image-preview {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
}

.upload-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f2f7;
  border: 1rpx dashed #ccc;
  font-size: 60rpx;
  color: #ccc;
}

.image-preview {
  position: relative;
  overflow: hidden;
}
.image-preview image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-tip {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #8e8e93;
  text-align: right;
}

/* 匿名选项 */
.anonymous-section {
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}
.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #1c1c1e;
}
.checkbox-group checkbox {
  margin-right: 10rpx;
}

/* 提交按钮 */
.submit-review-btn {
  background: #007aff;
  color: #fff;
  text-align: center;
  font-size: 32rpx;
  padding: 24rpx 0;
  border-radius: 16rpx;
  border: none;
  margin: 0 32rpx 32rpx;
}
/* ===== 按钮大小调整（附加至文件末尾） ===== */
/* 统一设置所有按钮的 flex 行为和最大宽度 */
.button-group .btn {
  flex: 1; /* 允许按钮平均分配空间并填充 */
  max-width: 280rpx; /* 限制按钮的最大宽度，防止过宽 */
  padding: 30rpx 0; /* 垂直内边距增至 30rpx */
  font-weight: 500; /* 统一字体粗细 */
  /* 其他样式保持不变 */
}
</style>
