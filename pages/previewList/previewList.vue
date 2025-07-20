<template>
	<view class="header-emptybox">
		<text class="profile-title">工人</text>
	</view>
  <view class="container">
    <!-- 分类导航 -->
    <scroll-view
      class="nav-scroll"
      scroll-x
      scroll-with-animation
      :scroll-left="scrollLeft"
      @scroll="onScroll"
    >
      <view class="nav-container">
        <view
          v-for="(item, index) in categories"
          :key="item.type"
          :id="`nav_${index}`"
          class="nav-item"
          :class="{ 
            active: currentCategory === item.type,
            'animate-active': currentCategory === item.type && animateActive
          }"
          @click="switchCategory(item.type, index)"
        >
          <view class="nav-item-inner">{{ item.name }}</view>
        </view>
      </view>
    </scroll-view>

    <!-- 服务列表 -->
    <view class="list-container" :class="{ fade: isFading }">
      <!-- 骨架屏 -->
      <view class="skeleton" v-if="!isLoaded && !hasError">
        <view class="skeleton-card" v-for="i in 3" :key="i">
          <view class="skeleton-avatar"></view>
          <view class="skeleton-content">
            <view class="skeleton-title"></view>
            <view class="skeleton-desc"></view>
          </view>
        </view>
      </view>

      <!-- 错误提示 -->
      <view v-else-if="hasError" class="error-state">
        <text class="error-message">网络不佳，数据加载失败。</text>
        <button class="retry-btn" @click="retryLoad">点击重试</button>
      </view>

      <!-- 列表或无数据 -->
      <view v-else>
        <view v-if="filteredList.length > 0">
          <view
            class="service-card"
            v-for="(item, idx) in filteredList"
            :key="item.id"
            @click="navigateDetail(item.id)"
          >
            <!-- 你的卡片渲染逻辑保持不变 -->
            <view class="top-right-container">
              <text class="service-area">{{ item.serviceArea || '未知' }}</text>
              <view class="distance-container" :class="{ hidden: !item.distance }">
                <text class="distance-text">{{ item.distance }}</text>
              </view>
            </view>
            <view class="left-column">
              <view class="img-container">
                <image
                  class="service-img"
                  :src="item.avatar || '/static/images/default-avatar.jpg'"
                  mode="aspectFill"
                />
              </view>
            </view>
            <view class="content-wrapper">
              <view class="title-row">
                <text class="service-title">{{ item.title }}</text>
              </view>
              <view class="info-section">
                <view class="info-item">
                  <text class="info-value">{{ item.categoriesDisplay || '暂无分类' }}</text>
                </view>
                <view class="info-item">
                  <text class="info-value desc-text">{{ item.description || '' }}</text>
                </view>
              </view>
              <view class="skills-container">
                <view
                  class="skill-tag"
                  v-for="(skill, skillIndex) in item.skills"
                  :key="skillIndex"
                >
                  {{ skill }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="no-data">当前分类没有用户数据</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref, onMounted, nextTick, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app'

const categories = ref([]);
const navArr = ref([]);
const serviceList = ref([]);
const filteredList = ref([]);
const isLoaded = ref(false); // 控制骨架屏和内容显示
const hasError = ref(false); // 新增：控制错误提示显示
const scrollLeft = ref(0);
const currentCategory = ref('all');
const animateActive = ref(false);
const isFading = ref(false);
const initialCategoryId = ref(null); // 新增：存储初始分类ID

let lastKnownScrollLeft = 0;
let scrollTimer = null;

// 新增：监听分类数据变化
watch(categories, (newVal) => {
  if (newVal.length > 0 && initialCategoryId.value) {
    applyInitialCategory();
  }
});

// 页面显示时读取初始分类ID
onShow(() => {
  const initId = uni.getStorageSync('initialCategoryId');
  if (initId) {
    uni.removeStorageSync('initialCategoryId');
    initialCategoryId.value = initId;
    if (categories.value.length > 0) {
      applyInitialCategory();
    }
  }
});

onMounted(async () => {
  await initialLoadData();
});

// 新增：初始加载数据函数，包含错误处理
async function initialLoadData() {
  isLoaded.value = false; // 重置加载状态
  hasError.value = false; // 重置错误状态
  uni.showLoading({ title: '加载中...', mask: true }); // 显示全局加载提示

  try {
    await loadNav(); // 加载分类
    await loadServices(); // 加载服务列表
  } catch (e) {
    console.error('Initial data load failed:', e);
    hasError.value = true; // 设置错误状态
    uni.showToast({ title: '数据加载失败，请重试', icon: 'none' });
  } finally {
    isLoaded.value = true; // 无论成功失败，都隐藏骨架屏
    uni.hideLoading(); // 隐藏全局加载提示
  }
}

// 新增：重试加载数据
function retryLoad() {
  initialLoadData();
}


async function loadNav() {
  try {
    const { result } = await uniCloud.callFunction({ name: 'getNavData' });
    const navData = result.data || [];
    navArr.value = navData;
    categories.value = [{ type: 'all', name: '全部' }].concat(
      navData.map(i => ({ type: i._id, name: i.classname }))
    );
  } catch (e) {
    console.error('加载分类数据失败:', e);
    throw new Error('加载分类失败'); // 抛出错误，让上层捕获
  }
}

async function loadServices() {
  try {
    // 1. 获取推荐列表
    const { result } = await uniCloud.callFunction({
      name: 'getRecommendedHomepages',
      data: { userLocation: uni.getStorageSync('userLocation') || {} }
    });
    const data = result.data || [];
  
    // 2. 前端计算距离并格式化
    const userLocation = uni.getStorageSync('userLocation') || {};
    const formatted = data.map(i => {
      let distance = '';
      if (
        userLocation.latitude != null &&
        userLocation.longitude != null &&
        i.latitude != null &&
        i.longitude != null
      ) {
        const d = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          i.latitude,
          i.longitude
        );
        distance = `${d.toFixed(1)}公里`;
      }
      const categoriesDisplay = (i.categories || [])
        .map(id => {
          const cat = navArr.value.find(c => c._id === id);
          return cat ? cat.classname : '';
        })
        .filter(Boolean)
        .join(', ') || '暂无分类';
  
      return {
        id: i._id,
        title: (i.name || '未命名').slice(0, 5),
        serviceArea: i.serviceArea,
        avatar: i.avatar || '',
        description: i.description || '',
        skills: i.skills || [],
        categories: i.categories || [],
        distance,
        categoriesDisplay
      };
    });
    serviceList.value = formatted;
    filteredList.value = formatted;
  } catch (e) {
    console.error('加载服务列表数据失败:', e);
    throw new Error('加载服务列表失败'); // 抛出错误，让上层捕获
  }
}

// 新增：应用初始分类
function applyInitialCategory() {
  const initId = initialCategoryId.value;
  if (!initId) return;
  
  const idx = categories.value.findIndex(c => c.type === initId);
  if (idx !== -1) {
    switchCategory(initId, idx);
  }
  
  // 重置初始分类ID
  initialCategoryId.value = null;
}

function switchCategory(type, idx) {
  if (currentCategory.value === type) return;
  isFading.value = true;
  setTimeout(() => {
    currentCategory.value = type;
    animateActive.value = true;
    filteredList.value =
      type === 'all'
        ? serviceList.value
        : serviceList.value.filter(i => i.categories.includes(type));
    nextTick(() => scrollToCategory(idx));
    setTimeout(() => {
      isFading.value = false;
      animateActive.value = false;
    }, 300);
  }, 10);
}

function scrollToCategory(idx) {
  uni.createSelectorQuery()
    .select(`#nav_${idx}`)
    .boundingClientRect()
    .select('.nav-scroll')
    .boundingClientRect()
    .exec(([itemRect, scrollRect]) => {
      if (!itemRect || !scrollRect) return;
      const offset = lastKnownScrollLeft +
        (itemRect.left + itemRect.width/2) -
        (scrollRect.width/2);
      scrollLeft.value = offset;
      lastKnownScrollLeft = offset;
    });
}

function onScroll(e) {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    lastKnownScrollLeft = e.detail.scrollLeft;
  }, 100);
}

function navigateDetail(id) {
  if (!id) return;
  uni.navigateTo({ url: `/pages/HomepageDetail/HomepageDetail?id=${id}` });
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const rad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLng/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function handleLogout() {
  // 1. 清除本地缓存
  uni.removeStorageSync('userinfo');
  uni.removeStorageSync('token'); // 如果有token的话

  // 2. 触发全局退出登录事件
  // 这会通知 App.vue 停止监听并移除 tabBar 角标
  uni.$emit('user-logout');

  // 3. 提示用户并跳转到登录页
  uni.showToast({
    title: '已退出登录',
    icon: 'none'
  });

  // 使用 reLaunch 跳转到登录页，清空页面栈
  uni.reLaunch({
    url: '/pages/login/login'
  });
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


<style lang="scss">
/* Color variables */
$primary-color: #4285F4;
$surface-color: #FFFFFF;
$secondary-text: #5F6368;
$primary-text: #202124;
$shadow-color: rgba(0, 0, 0, 0.1);
.header-emptybox {
  width: 100%;
  height: 230rpx;
  position: relative; // 必须加这个，才能让子元素绝对定位生效
}
.profile-title {
  position: absolute;            // ✅ 缺失的关键属性
  font-size: 55rpx;            // 字体大
  font-weight: 580;            // 半粗体，接近 Airbnb 标题
  color: #1c1c1e;             // 深灰，比纯黑柔和
  font-family: "Helvetica Neue", "PingFang SC", "Helvetica", "Arial", sans-serif; // Airbnb 常用字体替代
  top: 130rpx;                 // ✅ 从容器顶部下移 50rpx
  left: 35rpx;
}
/* Navigation Bar */
.nav-scroll {
  background: $surface-color;
  padding: 12rpx 0;
  box-shadow: 0 1px 2px $shadow-color;
  white-space: nowrap;
  position: relative;
  z-index: 10;
  overflow: hidden;
  
  &::-webkit-scrollbar {
    display: none;
  }

  .nav-container {
    display: flex;
    padding: 0 32rpx;
    position: relative;
  }

  .nav-item {
    flex-shrink: 0;
    padding: 16rpx 0;
    margin: 0 12rpx;
    font-size: 28rpx;
    color: $secondary-text;
    border-radius: 999rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    position: relative;
    z-index: 1;
    
    &-inner {
      padding: 16rpx 32rpx;
      transition: all 0.3s ease;
      display: block;
    }

    &.active {
      color: $primary-color;
      font-weight: 500;
      
      .nav-item-inner {
        position: relative;
        z-index: 2;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: rgba($primary-color, 0.1);
        border-radius: 999rpx;
        transform: translate(-50%, -50%) scale(1);
        z-index: 1;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
    
    &.animate-active {
      transform: scale(1.05);
      
      &::before {
        transform: translate(-50%, -50%) scale(1.15);
        opacity: 0.8;
      }
    }
    
    &:not(.active) {
      &:hover, &:active {
        transform: scale(0.95);
        opacity: 0.9;
      }
    }
  }
}

/* Service List Container */
.list-container {
  padding: 32rpx;
  background: #F8F9FA;
  transition: opacity 0.3s ease;
  
  &.fade {
    opacity: 0;
  }
}

/* Service Card */
.service-card {
  position: relative;
  background: $surface-color;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  padding: 24rpx;
  display: flex;
  box-shadow: 0 4rpx 8rpx $shadow-color;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.15);
  }

  .top-right-container {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 2;

    .service-area {
      font-size: 28rpx;
      color: $secondary-text;
      margin-bottom: 8rpx;
    }

    .distance-container {
      background: rgba($primary-color, 0.1);
      padding: 8rpx 16rpx;
      border-radius: 16rpx;
      transition: opacity 0.2s;

      .distance-text {
        color: $primary-color;
        font-size: 24rpx;
        font-weight: 500;
      }

      &.hidden {
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  .left-column {
    width: 160rpx;
    margin-right: 24rpx;
    flex-shrink: 0;

    .img-container {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;
      transition: transform 0.3s;

      .service-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }
    }
  }

  .content-wrapper {
    flex: 1;
    min-width: 0;
    padding-right: 120rpx;

    .title-row {
      margin-bottom: 16rpx;

      .service-title {
        font-size: 34rpx;
        color: $primary-text;
        font-weight: 600;
        line-height: 1.4;
        transition: color 0.2s;
      }
    }

    .info-section {
      margin-bottom: 16rpx;

      .info-item {
        display: flex;
        margin-bottom: 8rpx;

        .info-value {
          font-size: 28rpx;
          color: $primary-text;
          overflow: hidden;
          text-overflow: ellipsis;

          &.desc-text {
            min-height: 30px;
            line-height: 30px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5;
            white-space: normal;
            overflow-wrap: break-word;
            word-break: keep-all;
          }
        }
      }
    }

    .skills-container {
      margin-top: 16rpx;
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
      overflow: hidden;
      padding-bottom: 8rpx;
      margin-left: -170rpx;
      width: calc(100% + 270rpx);

      .skill-tag {
        flex-shrink: 0;
        background: #F1F3F4;
        color: #3C4043;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        transition: all 0.2s;
      }
    }
  }
  
  &:hover {
    .service-title {
      color: $primary-color;
    }
    
    .img-container {
      transform: scale(1.05);
    }
  }
}

/* Skeleton Loading Style */
.skeleton {
  padding: 32rpx;
  
  .skeleton-card {
    background: $surface-color;
    border-radius: 24rpx;
    margin-bottom: 32rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    animation: skeleton-pulse 1.5s infinite;
    
    .skeleton-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      background: #e0e0e0;
      margin-right: 24rpx;
    }
    
    .skeleton-content {
      flex: 1;
      
      .skeleton-title {
        width: 80%;
        height: 34rpx;
        background: #e0e0e0;
        margin-bottom: 16rpx;
        border-radius: 8rpx;
      }
      
      .skeleton-desc {
        width: 60%;
        height: 28rpx;
        background: #e0e0e0;
        border-radius: 8rpx;
      }
    }
  }
  
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
}

/* No Data Hint */
.no-data {
  text-align: center;
  color: $secondary-text;
  font-size: 28rpx;
  padding: 32rpx;
}

/* New: Error State Styles */
.error-state {
  text-align: center;
  padding: 60rpx;
  color: #ff3b30; /* 红色错误提示 */
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300rpx; /* 确保有足够高度显示 */
}

.error-message {
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.retry-btn {
  background-color: #007aff;
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
  outline: none;
  &:active {
    opacity: 0.8;
  }
}
</style>
