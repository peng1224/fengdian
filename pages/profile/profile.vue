<template>
    <view class="profile-page">
        <template v-if="!userinfo._id">
            <view class="welcome-container">
                <view class="welcome-content">
                    <view class="logo-placeholder">
                        <uni-icons type="paperplane-filled" size="80" color="#007aff"></uni-icons>
                    </view>
                    <text class="welcome-title">欢迎使用</text>
                    <text class="welcome-subtitle">登录以发现更多精彩内容和服务</text>
                </view>
                <button class="primary-button login-button" @click="goToLoginPage">
                    登录 / 注册
                </button>
            </view>
        </template>

        <template v-else>
            <view class="header-emptybox">
                <text class="profile-title">个人中心</text>
            </view>

            <view class="profile-header logged-in" @click="onEditProfile">
                <view class="avatar-wrapper">
                    <image
                        class="avatar"
                        :src="userinfo.avatar || '/static/images/default-avatar.png'"
                        mode="aspectFill"
                    />
                    <!-- 仅当身份为 worker 且审核状态为 approved 时显示徽章 -->
                    <view v-if="userinfo.userType === 'worker' && userinfo.technicianApplicationStatus === 'approved'" class="verification-badge">
                        <uni-icons type="auth-filled" color="#ffffff" size="14"></uni-icons>
                    </view>
                </view>
                <view class="user-info">
                    <text class="user-name">{{ userinfo.name || '设置昵称' }}</text>
                    <text class="edit-hint">查看并编辑个人资料</text>
                </view>
                <uni-icons class="arrow-icon" type="forward" size="20" color="#c0c4cc"></uni-icons>
            </view>

            <!-- 管理员入口 -->
            <view class="action-list">
                <view v-if="userinfo.userType === 'admin'" class="action-item" @click="goToReviewApplications">
                    <uni-icons type="checkbox-filled" size="24" color="#ff0852"></uni-icons>
                    <view class="action-text-wrapper">
                        <text class="action-text">审核技工申请</text>
                        <text class="action-subtitle">管理员审核技工认证申请</text>
                    </view>
                    <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                </view>
                <!-- 新增：审核提现申请入口 -->
                <view v-if="userinfo.userType === 'admin'" class="action-item" @click="goToReviewWithdrawals">
                    <uni-icons type="wallet-filled" size="24" color="#ff0852"></uni-icons>
                    <view class="action-text-wrapper">
                        <text class="action-text">审核提现申请</text>
                        <text class="action-subtitle">处理工人提现请求</text>
                    </view>
                    <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                </view>
            </view>

            <!-- 我的预约入口 (已调换位置) -->
            <view class="action-list">
                <view class="action-item" @click="goToUserSchedule">
                    <uni-icons type="calendar-filled" size="24" color="#ff9500"></uni-icons>
                    <view class="action-text-wrapper">
                        <text class="action-text">我的预约</text>
                        <text class="action-subtitle">查看和管理我预约的服务</text>
                    </view>
                    <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                </view>
            </view>

            <!-- 申请成为技工/技工相关入口 (已调换位置) -->
            <view class="action-list">
                <block v-if="userinfo.userType === 'worker' && userinfo.technicianApplicationStatus === 'approved'">
                    <view class="action-item" @click="goToWorkerHomepage">
                        <uni-icons type="person-filled" size="24" color="#007aff"></uni-icons>
                        <view class="action-text-wrapper">
                            <text class="action-text">我的工人主页</text>
                            <text class="action-subtitle">管理服务项目与个人信息</text>
                        </view>
                        <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                    </view>
                    <view class="action-item" @click="goToWorkerSchedule">
                        <uni-icons type="calendar-filled" size="24" color="#34c759"></uni-icons>
                        <view class="action-text-wrapper">
                            <text class="action-text">我的工单</text>
                            <text class="action-subtitle">查看和处理客户预约</text>
                        </view>
                        <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                    </view>
                    <!-- 新增提现入口 -->
                    <view class="action-item" @click="goToWithdrawalPage">
                        <uni-icons type="wallet-filled" size="24" color="#ff9500"></uni-icons>
                        <view class="action-text-wrapper">
                            <text class="action-text">提现</text>
                            <text class="action-subtitle">申请提现您未结算的金额</text>
                        </view>
                        <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                    </view>
                </block>

                <block v-else-if="userinfo.technicianApplicationStatus === 'pending'">
                    <view class="action-item disabled">
                        <view class="spinner-container">
                            <uni-load-more status="loading" :showText="false" color="#999"></uni-load-more>
                        </view>
                        <view class="action-text-wrapper">
                            <text class="action-text">技工认证审核中</text>
                            <text class="action-subtitle">我们正在加紧处理您的申请</text>
                        </view>
                    </view>
                </block>

                <block v-else-if="userinfo.technicianApplicationStatus === 'rejected'">
                    <view class="action-item-header">
                        <view class="status-badge rejected">
                            <uni-icons type="close-filled" color="#ff3b30" size="16"></uni-icons>
                            <text>技工认证被拒绝</text>
                        </view>
                    </view>
                    <view class="action-item" @click="goToApplyPage">
                        <uni-icons type="compose" size="24" color="#ff9500"></uni-icons>
                        <view class="action-text-wrapper">
                            <text class="action-text">重新申请认证</text>
                            <text class="action-subtitle">查看拒绝原因并修改资料</text>
                        </view>
                        <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                    </view>
                </block>

                <block v-else>
                    <view class="action-item" @click="goToApplyPage">
                        <uni-icons type="plus-filled" size="24" color="#007aff"></uni-icons>
                        <view class="action-text-wrapper">
                            <text class="action-text">申请成为技工</text>
                            <text class="action-subtitle">发布您的技能，开始接单</text>
                        </view>
                        <uni-icons class="arrow-icon" type="forward" size="18" color="#c0c4cc"></uni-icons>
                    </view>
                </block>
            </view>

            <view class="action-list">
                <view class="action-item danger" @click="exitLogin">
                    <text class="action-text">退出登录</text>
                </view>
            </view>
        </template>
    </view>
</template>

<script setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref } from 'vue';
import Footer from '../footer.vue';
import { onShow } from '@dcloudio/uni-app';

const userinfo = ref({});

onShow(() => {
    const info = uni.getStorageSync('userinfo');
    userinfo.value = info && info._id ? info : {};
});

function goToLoginPage() {
    uni.navigateTo({ url: '/pages/login/login' });
}

function exitLogin() {
    uni.showModal({
        title: '提示',
        content: '确认退出？',
        success: (res) => {
            if (res.confirm) {
                uni.removeStorageSync('userinfo');
                userinfo.value = {};
            }
        }
    });
}

// 跳转到提现页面
function goToWithdrawalPage() {
    uni.navigateTo({ url: '/pages/Payouts/Payouts' });
}

function goToWorkerHomepage() {
    uni.navigateTo({ url: '/pages/Homepage/Homepage' });
}

function goToWorkerSchedule() {
    uni.navigateTo({ url: '/pages/worker-schedule/worker-schedule' });
}

function goToApplyPage() {
    uni.navigateTo({ url: '/pages/applyTechnician/applyTechnician' });
}

function onEditProfile() {
    uni.navigateTo({ url: '/pages/EditProfile/EditProfile' });
}

function goToUserSchedule() {
    uni.navigateTo({ url: '/pages/user-schedule/user-schedule' });
}

// 【新增】管理员审核入口方法
function goToReviewApplications() {
    uni.navigateTo({ url: '/pages/admin/ReviewApplications/ReviewApplications' });
}

// 【新增】管理员审核提现申请入口方法
function goToReviewWithdrawals() {
    uni.navigateTo({ url: '/pages/admin/ReviewWithdrawals/ReviewWithdrawals' }); // 新页面的路径
}

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
// 主题色定义
$background-color: #f8f9fa;
$card-background-color: #ffffff;
$primary-text-color: #1c1c1e;
$secondary-text-color: #8a8a8e;
$primary-action-color: #007aff;
$success-color: #34c759;
$warning-color: #ff9500;
$danger-color: #ff3b30;
$separator-color: #e5e5ea;


// 页面根容器
.profile-page {
    background-color: $background-color;
    min-height: calc(100vh - 50px); // 减去底部导航栏高度
    width: 100%;
    padding-bottom: 50px; // 防止内容被Footer遮挡
}

// ====================================================
// 未登录页面 (全新)
// ====================================================
.welcome-container {
	transform: translateY(50rpx); // ✅ 整体下移
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: calc(100vh - 50px); // 占满整个屏幕
    padding: 15vh 50rpx 10vh;
    box-sizing: border-box;
}

.welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.logo-placeholder {
    width: 230rpx;
    height: 230rpx;
    border-radius: 50%;
    background-color: #e9e9eb;
    display: flex;
    align-items: center;
    justify-content: center;
	margin-top: 30rpx;
    margin-bottom: 40rpx;
    uni-icons {
        opacity: 0.8;
    }
}

.welcome-title {
    font-size: 48rpx;
    font-weight: 600;
    color: $primary-text-color;
    margin-bottom: 16rpx;
}

.welcome-subtitle {
    font-size: 30rpx;
    color: $secondary-text-color;
    max-width: 80%;
}

.login-button {
    width: 80%;
    height: 96rpx;
    line-height: 96rpx;
    border-radius: 48rpx;
    background-color: $primary-action-color;
    color: #fff;
    font-size: 34rpx;
    font-weight: 500;
    border: none;
	margin-bottom: 180rpx; // ✅ 关键：向上挤压
    &:after {
        border: none;
    }
}


// ====================================================
// 已登录页面
// ====================================================
.header-emptybox {
  width: 100%;
  height: 230rpx;
  background-color: #f2f2f7;  
  position: relative; // 必须加这个，才能让子元素绝对定位生效
}
.profile-title {
  position: absolute;           // ✅ 缺失的关键属性
  font-size: 55rpx;           // 字体大
  font-weight: 580;           // 半粗体，接近 Airbnb 标题
  color: #1c1c1e;            // 深灰，比纯黑柔和
  font-family: "Helvetica Neue", "PingFang SC", "Helvetica", "Arial", sans-serif; // Airbnb 常用字体替代
  top: 130rpx;                // ✅ 从容器顶部下移 50rpx
  left: 35rpx;
}
.profile-header {
    display: flex;
    align-items: center;
    padding: 40rpx;
    background-color: $card-background-color;
    margin-bottom: 20rpx;
    border-radius: 50rpx;
    &.logged-in {
        cursor: pointer;
        transition: background-color 0.2s;
        &:active {
            background-color: #f0f0f0;
        }
    }
}

.avatar-wrapper {
    position: relative; // 为徽章定位
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    overflow: visible; // 允许徽章溢出
    margin-right: 30rpx;
    flex-shrink: 0;

    .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
    }
}

// 【新增】认证徽章样式
.verification-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 44rpx;
    height: 44rpx;
    background: $success-color;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4rpx solid #ffffff; // 白色描边，使其与头像分离
    box-sizing: border-box;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.user-name {
    font-size: 44rpx;
    font-weight: 600;
    color: $primary-text-color;
    margin-bottom: 8rpx;
}
.edit-hint {
    font-size: 28rpx;
    color: $secondary-text-color;
}

// 功能列表
.action-list {
    background-color: $card-background-color;
    border-radius: 20rpx;
    margin: 0 24rpx 30rpx;
    overflow: hidden;
}

.action-item {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx; // 增加垂直内边距
    min-height: 120rpx;  // 保证最小高度
    box-sizing: border-box;
    background-color: $card-background-color;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        left: 120rpx; // 左侧缩进，对齐文字
        height: 1px;
        background-color: $separator-color;
        transform: scaleY(0.5);
    }
    
    &:active {
        background-color: #f0f0f0;
    }

    &.disabled {
        color: $secondary-text-color;
        cursor: default;
        &:active {
            background-color: $card-background-color;
        }
    }

    &.danger {
        justify-content: center; // 文字居中
        .action-text {
            color: $danger-color;
            flex: none;
            margin: 0;
        }
    }
}

.action-text-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 30rpx;
    gap: 4rpx;
}

.action-text {
    font-size: 32rpx;
    color: $primary-text-color;
    font-weight: 500; // 加粗
}

.action-subtitle {
    font-size: 26rpx;
    color: $secondary-text-color;
}

.arrow-icon {
    margin-left: auto;
}

.spinner-container {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-item-header {
    padding: 20rpx 30rpx;
    display: flex;
    border-bottom: 1px solid $separator-color;
}

.status-badge {
    padding: 8rpx 20rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    font-weight: 500;

    &.rejected {
        background-color: #fff0f0;
        color: $danger-color;
        uni-icons {
            color: $danger-color !important;
        }
    }
}
</style>
