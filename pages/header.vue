<!-- components/header.vue -->
<template>
  <view class="header-emptybox">
    <text class="profile-title">{{ title }}</text>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '标题'
  }
});
</script>

<style scoped lang="scss">
.header-emptybox {
  width: 100%;
  height: 230rpx;
  background-color: #f2f2f7;
  position: relative;
}
.profile-title {
  position: absolute;
  font-size: 55rpx;
  font-weight: 580;
  color: #1c1c1e;
  font-family: "Helvetica Neue", "PingFang SC", "Helvetica", "Arial", sans-serif;
  top: 130rpx;
  left: 50%;
  transform: translateX(-165%);
}
</style>
