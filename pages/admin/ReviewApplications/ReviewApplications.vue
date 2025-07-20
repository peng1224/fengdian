<template>
  <view class="page">
    <view class="title">待审核技工申请</view>
    <scroll-view class="list" scroll-y>
      <view v-for="item in list" :key="item._id" class="card">
        <view class="label">姓名：{{ item.technicianInfo.realName }}</view>
        <view class="label">身份证号：{{ item.technicianInfo.idCard }}</view>
        <view class="label">技能：{{ item.technicianInfo.skills }}</view>
        <view class="certs">
          <image
            v-for="(c, i) in item.technicianInfo.certificates"
            :key="i"
            :src="c"
            class="cert-img"
            mode="aspectFill"/>
        </view>
        <view class="actions">
          <button @click="review(item._id, 'approve')" type="primary">通过</button>
          <button @click="review(item._id, 'reject')" type="warn">拒绝</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const list = ref([]);

// 使用云函数拉取待审核列表
async function loadPending() {
  const { result } = await uniCloud.callFunction({
    name: 'getPendingApplications'
  });
  if (result.success) {
    list.value = result.data;
  } else {
    uni.showToast({ title: result.msg || '加载失败', icon: 'none' });
  }
}

// 审核函数保持不变
async function review(uid, action) {
  let reason = '';
  if (action === 'reject') {
    const { confirm, content } = await new Promise(resolve => {
      uni.showModal({
        title: '拒绝原因',
        placeholderText: '请输入原因',
        editable: true,
        success: resolve
      });
    });
    if (!confirm) return;
    reason = content;
  }
  uni.showLoading({ title: '提交审核...' });
    try {
      const res = await uniCloud.callFunction({
        name: 'reviewTechnicianApplication',
        data: { uid, action, reason }
      });
      console.log('reviewTechnicianApplication 返回：', res);
      uni.hideLoading();
      if (res.result && res.result.success) {
        uni.showToast({ title: '操作成功', icon: 'success' });
        await loadPending();
      } else {
        uni.showToast({ title: (res.result && res.result.msg) || '操作失败', icon: 'none' });
      }
    } catch (err) {
      uni.hideLoading();
      console.error('调用 reviewTechnicianApplication 错误：', err);
      uni.showToast({ title: '网络或服务异常', icon: 'none' });
    }
    }

onMounted(() => {
  const user = uni.getStorageSync('userinfo') || {};
  if (user.userType !== 'admin') {
    uni.showToast({ title: '无权限访问', icon: 'none' });
    uni.reLaunch({ url: '/pages/profile/profile' });
  } else {
    loadPending();
  }
});
</script>

<style scoped>
.page { padding: 20rpx; background: #f5f5f5; }
.title { font-size: 36rpx; margin-bottom: 20rpx; }
.list { max-height: 100%; }
.card {
  background: #fff; padding: 20rpx; border-radius: 12rpx; margin-bottom: 20rpx;
}
.label { font-size: 28rpx; color: #333; margin-bottom: 10rpx; }
.certs { flex-direction: row; margin: 10rpx 0; }
.cert-img { width: 100rpx; height: 100rpx; border-radius: 8rpx; margin-right: 10rpx; }
.actions { flex-direction: row; justify-content: flex-end; gap: 20rpx; margin-top: 10rpx; }
</style>