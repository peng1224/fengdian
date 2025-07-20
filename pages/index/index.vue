<template>
	<view class="header-emptybox">
		<text class="profile-title">首页</text>
	</view>
  <view>
    <!-- 地图容器 -->
    <view class="map-container">
      <map
        :latitude="latitude"
        :longitude="longitude"
        :scale="16"
        show-location
        style="width:100%; height:420rpx;"
      />
      <button class="location-button" @click="getUserLocation">
        <image src="/static/images/my location.png" mode="aspectFit" />
      </button>
    </view>

    <!-- 分类导航 -->
    <view class="scroollNav">
      <view v-if="navArr.length === 0" class="empty-state">
        <text>暂无分类</text>
      </view>
      <view
        v-for="(item, index) in navArr"
        :key="item._id"
        class="item"
        @click="handleNavClick(item._id)"
      >
        <view class="pic">
          <image
            :src="item.icon || '/static/images/default-icon.png'"
            mode="aspectFit"
            @error="handleImageError"
          />
        </view>
        <view class="text">{{ item.classname }}</view>
      </view>
    </view>

    <!-- 新闻资讯 -->
    <view class="news">
      <view class="pubTitle"><view class="cn">新闻资讯</view></view>
      <view
        v-for="(item, index) in newsArr"
        :key="item._id"
        class="content"
        @click="onNewsClick(item._id, index)"
      >
        <view class="box"><NewsItem :item="item" /></view>
      </view>
    </view>

    <!-- 关于我们 -->
    <view class="about">
      <view class="pubTitle"><view class="cn">蜂点到家</view></view>
      <view class="content">
        <view class="row">
          <view>欢迎使用「蜂点到家」小程序</view>
          <view>本平台专注于本地家政与上门服务的高效预约与对接。</view>
          <view>我们致力于为用户打造一个透明、便捷、安全的服务环境。</view>
          <view>每一位服务人员都可以清晰展示自己的服务范围、技能优势和可预约时间。</view>
          <view>无论是家政保洁、家电清洗，还是上门维修，「蜂点到家」都为你提供可靠选择。</view>
          <view>让优质服务直达用户家门，让服务人员高效获取订单，蜂点到家，让服务更简单。</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref, onMounted } from 'vue';
import NewsItem from '../news-item.vue';
import Footer from '../footer.vue';

const navArr = ref([]);
const latitude = ref(0);
const longitude = ref(0);
const newsArr = ref([]);

// 点击分类：先缓存 catId，再 switchTab 到 previewList
function handleNavClick(categoryId) {
  console.log('[index] 点击分类，缓存 categoryId=', categoryId);
  uni.setStorageSync('initialCategoryId', categoryId);
  uni.switchTab({
    url: '/pages/previewList/previewList'
  });
}

function handleImageError(e) {
  console.error('图片加载失败', e);
}

function getUserLocation() {
  uni.showLoading({ title: '定位中...' });
  uni.getLocation({
    type: 'gcj02',
    success(res) {
      uni.hideLoading();
      latitude.value = res.latitude;
      longitude.value = res.longitude;
	  // 缓存到本地，后面其他页面需要
      uni.setStorageSync('userLocation', {
        latitude: res.latitude,
        longitude: res.longitude
      });
    },
    fail() {
      uni.hideLoading();
      uni.showToast({ title: '获取位置失败', icon: 'none' });
    }
  });
}

async function getNavData() {
  try {
    uni.showLoading({ title: '加载中...' });
    const res = await uniCloud.callFunction({ name: 'getNavData' });
    uni.hideLoading();
    if (res.result.code === 0) {
      navArr.value = res.result.data.filter(i => i.icon && i.classname);
    }
  } catch {
    uni.hideLoading();
    uni.showToast({ title: '导航加载失败', icon: 'none' });
  }
}

async function getNewsData() {
  try {
    const res = await uniCloud.callFunction({ name: 'getNewsData' });
    if (res.result.data) {
      newsArr.value = res.result.data.map(item => ({
        ...item,
        view_count_display: formatNum(item.view_count),
        publish_date: formatTime(item.publish_date)
      }));
    }
  } catch {
    uni.showToast({ title: '新闻加载失败', icon: 'none' });
  }
}

function formatNum(n) {
  return n > 10000 ? (n / 10000).toFixed(1) + '万' : n;
}
function formatTime(d) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}-${dt.getDate()}`;
}

// index.vue 中的 onNewsClick 函数
async function onNewsClick(id, idx) {
  uni.vibrateShort && uni.vibrateShort();
  await uniCloud.callFunction({ name: 'upNewsview_count', data: { id } });
  newsArr.value[idx].view_count++;
  newsArr.value[idx].view_count_display = formatNum(newsArr.value[idx].view_count);
  
  // 新增跳转到新闻详情页
  uni.navigateTo({
    url: `/pages/newsDetail/newsDetail?id=${id}`
  });
}



onMounted(() => {
  getNavData();
  getUserLocation();
  getNewsData();
});

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
/* 全局变量：点缀色、文字色、背景色、分割线 */
:root {
  --primary-accent: #007AFF;   /* 黄色点缀 */
  --text-main:    #333333;     /* 主要文字 (深灰) */
  --text-sub:     #666666;     /* 次要文字 (中灰) */
  --line-gray:    #E5E5E5;     /* 分割线 (浅灰) */
  --bg-white:     #FFFFFF;     /* 白色 */
  --bg-light:     #F7F8FA;     /* 浅灰背景 */
  --blue-accent:  #3978F7;     /* 交互高亮蓝 */
  --globalcolor:  #333333;     /* 全局颜色 */
}

.header-emptybox {
  width: 100%;
  height: 230rpx;
  position: relative; // 必须加这个，才能让子元素绝对定位生效
}
.profile-title {
  position: absolute;           // ✅ 缺失的关键属性
  font-size: 55rpx;          // 字体大
  font-weight: 580;          // 半粗体，接近 Airbnb 标题
  color: #1c1c1e;            // 深灰，比纯黑柔和
  font-family: "Helvetica Neue", "PingFang SC", "Helvetica", "Arial", sans-serif; // Airbnb 常用字体替代
  top: 130rpx;                    // ✅ 从容器顶部下移 50rpx
  // left: 50%;                     // 居中基准线
  left: 35rpx;
  // transform: translateX(-165%);  // 居中
}

/* 地图容器 */
.map-container {
  position: relative;
  margin-top: 20rpx;
  padding: 0 30rpx 20rpx;
  background: var(--bg-white);

  map {
    width: 100%;
    height: 420rpx;
    border-radius: 24rpx;
    overflow: hidden;
    border: 1rpx solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  }

  .location-button {
    position: absolute;
    right: 50rpx;
    bottom: 40rpx;
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background: var(--bg-white);
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    transition: transform 0.1s;

    &:active {
      transform: scale(0.95);
    }

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}

/* 导航菜单 */
.scroollNav {
  padding: 20rpx 30rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20rpx;

.item {
    text-align: center;
    transition: transform 0.1s;

    &:active {
  transform: scale(0.95);
}

.pic {
      width: 80rpx;
      height: 80rpx;
      margin: 0 auto;
      image {
        width: 100%;
        height: 100%;
}
    }

.text {
      font-size: 26rpx;
      color: #333333;
      padding-top: 8rpx;
    }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  color: var(--text-color);
  font-size: 28rpx;
}

/* 新闻资讯 */
.news {
  padding: 30rpx 30rpx;
  .content {
    transition: transform 0.1s;
    &:active { transform: scale(0.98); }
    .box {
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
      padding: 8rpx 12rpx;
    }
  }
}

/* 关于我们 */
.about {
  padding: 50rpx 30rpx 80rpx;
  .content {
    .row {
      line-height: 1.6em;
      text-indent: 2em;
      font-size: 32rpx;
      padding: 20rpx 0;
      border-bottom: 1rpx dashed var(--primary-accent);
      color: var(--globalcolor);
      &:first-child { padding-top: 0; }
      &:last-child  { border-bottom: none; padding-bottom: 0; }
    }
  }
}

.pubTitle {
  position: relative;
  margin: 0 0 32rpx 0;
  padding: 0 30rpx 0 30rpx;
  text-align: left;
  background: none;
  .cn {
    display: inline-block;
    font-size: 56rpx;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 2rpx;
    position: relative;
    padding-left: 22rpx;
    line-height: 1.2;
    background: none;
    &::before {
      content: '';
      display: inline-block;
      width: 10rpx;
      height: 44rpx;
      background: var(--primary-accent, #3978F7);
      border-radius: 5rpx;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2rpx;
    background: linear-gradient(90deg, #e3eaf3 0%, #f7f8fa 100%);
    margin-top: 12rpx;
    border-radius: 1rpx;
  }
}

.nsitem {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
  margin-bottom: 4rpx;
  min-height: 150rpx;
  overflow: hidden;
  .pic {
    width: 220rpx;
    height: 150rpx;
    flex-shrink: 0;
    .img {
  width: 100%;
      height: 100%;
      border-radius: 16rpx 0 0 16rpx;
      object-fit: cover;
      display: block;
    }
  }
  .text {
    flex: 1 1 0%;
    min-width: 0;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 18rpx 24rpx;
    box-sizing: border-box;
    .title {
      line-height: 1.4em;
      color: var(--primary-accent);
      font-size: 32rpx;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 16rpx;
      white-space: normal;
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 32rpx;
      flex-wrap: nowrap;
      font-size: 28rpx;
      color: var(--text-sub);
      .block {
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
      .icon-class {
        color: var(--text-sub);
        margin-right: 6rpx;
      }
    }
  }
}
</style>