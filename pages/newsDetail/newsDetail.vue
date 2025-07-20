<template>
  <view class="container">
    <view v-if="!detail" style="padding:80rpx 30rpx;">
      <uni-skeleton title :row="5" />
    </view>

    <view v-else class="detail">
      <view class="title">
        {{ detail.title }}
      </view>
      <view class="info">
        <view class="left">      
          <text>{{ detail.publish_date }}</text> 
          <text>{{ detail.author }}</text>
          <text>{{ detail.view_count }}阅读</text>
        </view>
        <view class="right">
          <uni-icons type="paperplane" size="18" class="icon-class" />
          <text>分享</text>
        </view>
      </view>
      <view class="content">    
        <rich-text :nodes="detail.content"></rich-text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const detail = ref(null);

// 格式化数字（阅读数）
function formatNum(n) {
  return n > 10000 ? (n / 10000).toFixed(1) + '万' : n;
}

// 格式化时间（这里简化，原逻辑是格式化为月-日）
function formatTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  return `${dt.getMonth() + 1}-${dt.getDate()}`;
}

onLoad((options) => {
  const id = options.id;
  getDetail(id);
});

// 获取新闻详情
async function getDetail(id) {
  try {
    uni.showLoading({ title: '加载中...' });
    const res = await uniCloud.callFunction({
      name: 'getNewsDetail',
      data: { id }
    });
    
    if (res.result && res.result.data) {
      const data = res.result.data;
      
      // 格式化处理
      data.publish_date = formatTime(data.publish_date);
      data.view_count = formatNum(data.view_count);
      
      // 处理内容样式
      data.content = data.content.replace(/<p/gi, "<p class='pstyle'"); 
      data.content = data.content.replace(/<img/gi, "<img class='imgstyle'"); 
      
      detail.value = data;
    }
  } catch (error) {
    console.error('获取新闻详情失败', error);
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  min-height: 100vh;
}

.detail {
  padding: 30rpx;
  .title {
    font-size: 60rpx;
    line-height: 1.5em;
    font-weight: 600;
  }
  .info {
    font-size: 28rpx;
    color: #999;
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 50rpx;
    .left {
      text {
        padding-right: 15rpx;
      }
    }
    .right {
      display: flex;
      align-items: center;
      color: var(--themeColor);
      position: relative;
      .share {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
      text {
        padding-left: 5rpx;
      }
    }
  }
  .content {
    .pstyle {
      padding: 10rpx 0;
      line-height: 1.6em;
    }
    .imgstyle {
      border-radius: 10rpx;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
