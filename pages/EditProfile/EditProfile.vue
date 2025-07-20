<template>
  <view class="container">
    <!-- 头像区域（点击更换） -->
    <view class="avatar-edit" @click="chooseAvatar">
      <image
        class="avatar"
        :src="avatarTemp || avatarOld || '/static/images/default-avatar.png'"
        mode="aspectFill"
      />
    </view>
    <text class="tip">点击更换头像</text>

    <!-- 姓名输入 -->
    <view class="field">
      <text class="label">姓名：</text>
      <input
        class="input"
        placeholder="请输入您的姓名"
        v-model="name"
      />
    </view>

    <!-- 工人专属：收款信息修改区域 -->
    <template v-if="isWorker">
      <view class="section-title">收款信息</view>
      <text class="section-tip">请确保收款信息准确无误，以便正常提现。</text>

      <!-- 微信号 -->
      <view class="field">
        <text class="label">微信号：</text>
        <input
          class="input"
          placeholder="请输入您的微信号 (可选)"
          v-model="weChatId"
        />
      </view>

      <!-- 微信收款码 -->
      <view class="field">
        <text class="label required-label">收款码：</text>
        <view class="qr-code-uploader">
          <view v-if="weChatQrCodeTemp || weChatQrCodeUrlOld" class="image-preview">
            <image
              :src="weChatQrCodeTemp || weChatQrCodeUrlOld"
              mode="aspectFill"
              class="uploaded-image"
            />
            <view class="delete-btn" @click="removeQrCode">×</view>
          </view>
          <view v-else class="upload-btn" @click="chooseQrCode">
            <text>+</text>
          </view>
        </view>
        <text class="tip">点击上传或更换收款码图片</text>
        <text v-if="isUploadingQrCode" class="uploading-tip">收款码上传中...</text>
      </view>
    </template>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="submitProfile" :loading="isLoading || isUploadingQrCode">保存修改</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const name = ref('')
const avatarOld = ref('')       // 原有头像 fileID
const avatarTemp = ref('')      // 本地临时路径
const avatarNewFileID = ref('') // 上传后的 fileID
const isLoading = ref(false); // 保存按钮的加载状态

// 工人专属数据
const isWorker = ref(false); // 是否是已认证的工人
const weChatId = ref('');
const weChatQrCodeUrlOld = ref('');       // 原有收款码 URL
const weChatQrCodeTemp = ref('');         // 本地临时路径
const weChatQrCodeNewFileID = ref('');    // 上传后的收款码 fileID
const isUploadingQrCode = ref(false);     // 收款码上传加载状态

// 页面加载时从本地读取 userinfo 并尝试更新
onMounted(async () => {
  let user = uni.getStorageSync('userinfo') || {};
  console.log('EditProfile - onMounted: 初始本地 userinfo:', user);

  // 如果本地有用户ID，尝试从云端获取最新数据
  if (user._id) {
    try {
      const { result } = await uniCloud.callFunction({
        name: 'getUserInfoById', // 调用新的云函数
        data: { userId: user._id }
      });

      if (result.success && result.data) {
        user = result.data; // 使用云端最新数据
        uni.setStorageSync('userinfo', user); // 更新本地缓存
        console.log('EditProfile - onMounted: 已从云端获取最新 userinfo 并更新本地缓存:', user);
      } else {
        console.warn('EditProfile - onMounted: 从云端获取用户数据失败:', result.message);
        // 如果获取失败，继续使用本地旧数据
      }
    } catch (err) {
      console.error('EditProfile - onMounted: 调用 getUserInfoById 云函数异常:', err);
      // 如果调用异常，继续使用本地旧数据
    }
  }

  // 使用最新（或本地旧）的 user 对象来初始化页面数据
  name.value = user.name || '';
  avatarOld.value = user.avatar || '';

  // 检查是否为已认证的工人
  if (user.userType === 'worker' && user.technicianApplicationStatus === 'approved') {
    isWorker.value = true;
    weChatId.value = user.technicianInfo?.weChatId || '';
    weChatQrCodeUrlOld.value = user.technicianInfo?.weChatQrCodeUrl || '';
  } else {
    isWorker.value = false;
  }
});

// 选择新头像
function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: res => {
      avatarTemp.value = res.tempFilePaths[0];
      avatarNewFileID.value = ''; // Reset newFileID until uploaded
    },
    fail: (err) => {
      console.error('选择头像失败:', err);
      uni.showToast({ title: '选择头像失败', icon: 'none' });
    }
  })
}

// 选择微信收款码
async function chooseQrCode() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: res => {
      weChatQrCodeTemp.value = res.tempFilePaths[0];
      weChatQrCodeNewFileID.value = ''; // Reset newFileID until uploaded
    },
    fail: (err) => {
      console.error('选择收款码失败:', err);
      uni.showToast({ title: '选择收款码失败', icon: 'none' });
    }
  });
}

// 移除微信收款码
function removeQrCode() {
  weChatQrCodeTemp.value = '';
  weChatQrCodeNewFileID.value = '';
  weChatQrCodeUrlOld.value = ''; // Clear old URL as well if removed
}


// 提交更新
async function submitProfile() {
  // 验证姓名
  if (!name.value.trim()) {
    return uni.showToast({ title: '姓名不能为空', icon: 'none' })
  }

  // 如果是工人，校验收款码是否已上传
  if (isWorker.value && !weChatQrCodeTemp.value && !weChatQrCodeUrlOld.value) {
    return uni.showToast({ title: '请上传微信收款码', icon: 'none' });
  }

  const userInfo = uni.getStorageSync('userinfo') || {}
  const phoneNumber = userInfo.phoneNumber
  if (!phoneNumber) {
    return uni.showToast({ title: '缺少用户标识符', icon: 'none' })
  }

  isLoading.value = true;
  uni.showLoading({ title: '保存中...' })

  try {
    // 1. 上传新头像（如有）
    if (avatarTemp.value) {
      const cloudPath = `User-Avatar/${Date.now()}.jpg`
      const uploadRes = await uniCloud.uploadFile({
        cloudPath,
        filePath: avatarTemp.value
      })
      if (!uploadRes.fileID) {
        throw new Error('头像上传失败')
      }
      avatarNewFileID.value = uploadRes.fileID
    }

    // 2. 上传新收款码（如果用户是工人且选择了新收款码）
    if (isWorker.value && weChatQrCodeTemp.value) {
      isUploadingQrCode.value = true;
      const cloudPathQr = `Worker-QrCodes/${userInfo._id}_${Date.now()}.png`; // Unique path for QR codes
      const uploadQrRes = await uniCloud.uploadFile({
        cloudPath: cloudPathQr,
        filePath: weChatQrCodeTemp.value
      });
      if (!uploadQrRes.fileID) {
        throw new Error('收款码上传失败');
      }
      weChatQrCodeNewFileID.value = uploadQrRes.fileID;
      isUploadingQrCode.value = false;
    }

    // 3. 准备发送给云函数的数据
    const dataToSend = {
      phoneNumber,
      name: name.value,
      avatar: avatarNewFileID.value || '', // 新头像 ID 或空字符串
      oldAvatarFileID: avatarOld.value || '', // 旧头像 ID，用于云端删除

      // 工人专属数据
      isWorker: isWorker.value, // 告诉云函数是否是工人
      weChatId: isWorker.value ? weChatId.value : '', // 仅工人身份时发送微信号
      weChatQrCodeUrl: isWorker.value ? (weChatQrCodeNewFileID.value || weChatQrCodeUrlOld.value || '') : '', // 新收款码 ID，或旧的，或空
      oldWeChatQrCodeUrl: isWorker.value ? weChatQrCodeUrlOld.value : '' // 旧收款码 ID，用于云端删除
    };

    // 4. 调用云函数更新用户信息
    const { result } = await uniCloud.callFunction({
      name: 'updateUserProfile', // 这个云函数需要被更新以处理工人信息
      data: dataToSend
    })
    if (result.code !== 200 || !result.success) {
      throw new Error(result.msg || '云函数返回错误')
    }

    // 5. 更新本地缓存
    uni.setStorageSync('userinfo', result.data)

    uni.hideLoading()
    uni.showToast({ title: '更新成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)

  } catch (err) {
    console.error('更新过程出错:', err)
    uni.hideLoading()
    isLoading.value = false; // 确保加载状态被重置
    isUploadingQrCode.value = false; // 确保加载状态被重置
    uni.showToast({ title: err.message || '更新失败，请重试', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-edit {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid var(--themeColor, #007aff); /* 默认主题色 */
  background: #fff;
  margin-bottom: 20rpx;
}
.avatar {
  width: 100%;
  height: 100%;
}

.tip {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 40rpx;
}

.field {
  width: 100%;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}
.label {
  font-size: 32rpx;
  width: 160rpx; /* 调整标签宽度 */
  flex-shrink: 0;
  color: #333;
}
.input {
  flex: 1;
  height: 64rpx;
  font-size: 28rpx;
  border-bottom: 2rpx solid #eee; /* 更柔和的底部边框 */
  padding: 0 10rpx;
}

.section-title {
  width: 100%;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-top: 60rpx;
  margin-bottom: 10rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
  text-align: left;
}
.section-tip {
  width: 100%;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 30rpx;
  display: block;
  text-align: left;
}

.required-label::after {
  content: '*';
  color: #ff3b30; /* 红色星号 */
  margin-left: 8rpx;
}

.qr-code-uploader {
  flex: 1;
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  align-items: center;
  margin-top: 10rpx;
}
.qr-code-uploader .image-preview {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  overflow: hidden;
  border: 1rpx solid #eee;
}
.qr-code-uploader .uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.qr-code-uploader .delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10rpx;
  font-size: 28rpx;
  z-index: 1;
}
.qr-code-uploader .upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ccc;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx; /* 更大的加号 */
  color: #ccc;
  background-color: #f9f9f9;
  &:active {
    border-color: #007aff;
    color: #007aff;
  }
}
.uploading-tip {
  font-size: 24rpx;
  color: #888;
  margin-top: 10rpx;
  margin-left: 20rpx;
}

.save-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
  background: linear-gradient(135deg, #1989fa, #4db8ff);
  border: none;
  border-radius: 50rpx;
  margin-top: 60rpx; /* 增加与上方内容的间距 */
}
</style>
