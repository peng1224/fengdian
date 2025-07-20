<template>
  <!-- 根模板无需改动 -->
  <slot />
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

let pollingTimer = null; // 轮询定时器

/**
 * 安全设置 TabBar Badge，仅在 TabBar 页面操作
 */
const safeSetTabBarBadge = (total) => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const tabBarRoutes = [
        'pages/index/index',
        'pages/previewList/previewList',
        'pages/chatList/chatList',
        'pages/profile/profile'
    ];
    if (!tabBarRoutes.includes(currentPage.route)) return;
    try {
        if (total > 0) {
            uni.setTabBarBadge({
                index: 2,
                text: total > 99 ? '99+' : total.toString()
            });
        } else {
            uni.removeTabBarBadge({ index: 2 });
        }
    } catch (e) {
        console.warn('[Global Polling] 设置/移除 TabBarBadge 失败:', e);
    }
};

/**
 * 获取总未读消息数并更新 TabBar 角标
 */
const fetchTotalUnreadCount = async (phoneNumber) => {
    if (!phoneNumber) return;
    try {
        const res = await uniCloud.callFunction({
            name: 'get-total-unread-count',
            data: { userPhoneNumber: phoneNumber }
        });
        if (res.result.success) {
            safeSetTabBarBadge(res.result.totalUnread || 0);
        }
    } catch (error) {
        console.error('[Global Polling] 获取总未读数失败:', error);
    }
};

/**
 * 静默同步最新 UserInfo 到 storage
 */
const syncUserInfo = async () => {
    const userInfo = uni.getStorageSync('userinfo');
    if (!userInfo?._id) return;
    try {
        const res = await uniCloud.callFunction({
            name: 'getUserInfo',
            data: { userId: userInfo._id }
        });
        if (res.result.code === 0 && res.result.userInfo) {
            uni.setStorageSync('userinfo', res.result.userInfo);
            console.log('[SyncUserInfo] 已同步最新 userInfo');
        }
    } catch (e) {
        console.error('[SyncUserInfo] 同步失败:', e);
    }
};

/**
 * 启动轮询机制
 */
const startPolling = () => {
    const userInfo = uni.getStorageSync('userinfo');
    const phone = userInfo?.phoneNumber;
    if (!phone) return;
    fetchTotalUnreadCount(phone);
    pollingTimer = setInterval(() => fetchTotalUnreadCount(phone), 45000);
};

/**
 * 停止轮询机制
 */
const stopPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
};

// --- App 生命周期 ---
onLaunch(() => {
    console.log('App 启动');
    startPolling();
});

onShow(async () => {
    console.log('App 显示');
    // 先静默同步最新用户信息
    await syncUserInfo();
    // 再启动或刷新轮询
    const userInfo = uni.getStorageSync('userinfo');
    if (userInfo?.phoneNumber) {
        if (!pollingTimer) {
            startPolling();
        } else {
            fetchTotalUnreadCount(userInfo.phoneNumber);
        }
    }
});

onHide(() => {
    console.log('App 隐藏');
    stopPolling();
});

// 全局事件
uni.$on('user-login', () => {
    stopPolling();
    startPolling();
});
uni.$on('user-logout', () => {
    stopPolling();
});
uni.$on('refresh-unread', () => {
    const userInfo = uni.getStorageSync('userinfo');
    if (userInfo?.phoneNumber) {
        fetchTotalUnreadCount(userInfo.phoneNumber);
    }
});
</script>

<style>
/* 保留或补充全局样式 */
</style>
