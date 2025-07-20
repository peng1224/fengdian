<template>
  <view class="apply-container">
    <view class="title">工人认证申请</view>
    <view class="form-card">
      <!-- 真实姓名 -->
      <view class="form-item">
        <text class="label">真实姓名</text>
        <input
          class="input"
          v-model="formData.realName"
          placeholder="请输入您的真实姓名"
        />
      </view>
      <!-- 身份证号 -->
      <view class="form-item">
        <text class="label">身份证号</text>
        <input
          class="input"
          v-model="formData.idCard"
          type="idcard"
          placeholder="请输入您的身份证号"
        />
      </view>
      <!-- 技能简介 -->
      <view class="form-item">
        <text class="label">技能简介</text>
        <textarea
          class="textarea"
          v-model="formData.skills"
          placeholder="简单介绍您的专业技能、服务范围等"
        ></textarea>
      </view>
      <!-- 上传证件图片 (纯手写实现) -->
      <view class="form-item">
        <text class="label">相关证件 (可选)</text>
        <view class="custom-file-picker">
          <view class="image-grid">
            <view v-for="(image, index) in imageValue" :key="index" class="image-item">
              <image :src="image.url" mode="aspectFill" class="uploaded-image" />
              <view class="delete-btn" @click="removeCertImage(index)">×</view>
            </view>
            <view v-if="imageValue.length < 3" class="upload-btn" @click="chooseCertImage">
              <text>+</text>
            </view>
          </view>
        </view>
        <text class="tip-text">用于辅助证明您的专业能力，如资格证书、作品图等。</text>
      </view>

      <!-- 新增：提现收款信息 -->
      <view class="form-section-title">提现收款信息</view>
      <text class="section-tip">请务必填写正确的收款信息，以便平台为您结算服务费用。</text>

      <!-- 微信号 (可选) -->
      <view class="form-item">
        <text class="label">微信号 (可选)</text>
        <input
          class="input"
          v-model="formData.weChatId"
          placeholder="请输入您的微信号"
        />
        <text class="tip-text">作为备用联系方式或打款参考。</text>
      </view>

      <!-- 微信收款码 (必填) -->
      <view class="form-item">
        <text class="label required-label">微信收款码</text>
        <view class="custom-file-picker">
          <view class="image-grid">
            <view v-if="imageValueQrCode.length > 0" class="image-item">
              <image :src="imageValueQrCode[0].url" mode="aspectFill" class="uploaded-image" />
              <view class="delete-btn" @click="removeQrCodeImage(0)">×</view>
            </view>
            <view v-else class="upload-btn" @click="chooseQrCodeImage">
              <text>+</text>
            </view>
          </view>
        </view>
        <text class="warning-text">
          <text class="warning-icon">!</text>
          请务必上传清晰有效的微信收款码截图。若因收款码错误导致打款失败或流向错误，平台不承担责任。
        </text>
      </view>

    </view>

    <button
      class="submit-btn"
      @click="submitApplication"
      :loading="isLoading"
      :disabled="isLoading"
    >
      {{ isLoading ? '提交中...' : '确认提交申请' }}
    </button>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// 移除了 uni-file-picker 的引入，因为现在使用自定义实现

const formData = reactive({
  realName: '',          // 真实姓名
  idCard: '',            // 身份证号
  skills: '',            // 技能简介
  certificates: [],      // 存储上传后的证件图片 URL 列表
  weChatId: '',          // 新增：微信号
  weChatQrCodeUrl: ''    // 新增：微信收款码图片的 URL
});

// imageValue 和 imageValueQrCode 现在存储 { url: 'temp_path', cloudUrl: 'cloud_path', loading: false } 结构
const imageValue = ref([]); // 用于证件图片，最多3张
const imageValueQrCode = ref([]); // 新增：用于微信收款码图片，最多1张
const isLoading = ref(false);

// 通用的图片选择和上传逻辑
async function chooseAndUploadImage(type, limit) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: limit - (type === 'cert' ? imageValue.value.length : imageValueQrCode.value.length), // 可选图片数量
      sizeType: ['compressed'], // 压缩图
      sourceType: ['album', 'camera'], // 从相册选择或拍照
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths;
        const uploadedUrls = [];

        // 更新前端显示为本地临时路径和加载状态
        const currentImages = type === 'cert' ? imageValue.value : imageValueQrCode.value;
        const newImages = tempFilePaths.map(path => ({ url: path, cloudUrl: '', loading: true }));
        if (type === 'cert') {
          imageValue.value = [...currentImages, ...newImages];
        } else {
          imageValueQrCode.value = newImages; // 收款码只允许一张，直接替换
        }

        for (let i = 0; i < tempFilePaths.length; i++) {
          const filePath = tempFilePaths[i];
          try {
            const uploadRes = await uniCloud.uploadFile({
              filePath: filePath,
              cloudPath: `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`, // 随机文件名
            });
            uploadedUrls.push(uploadRes.fileID);

            // 更新对应图片的 cloudUrl 和 loading 状态
            const indexToUpdate = (type === 'cert' ? imageValue.value : imageValueQrCode.value).findIndex(img => img.url === filePath);
            if (indexToUpdate !== -1) {
              if (type === 'cert') {
                imageValue.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                imageValue.value[indexToUpdate].loading = false;
              } else {
                imageValueQrCode.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                imageValueQrCode.value[indexToUpdate].loading = false;
              }
            }
            console.log(`文件上传成功: ${uploadRes.fileID}`);

          } catch (uploadError) {
            console.error(`文件上传失败: ${filePath}`, uploadError);
            uni.showToast({ title: `图片上传失败: ${uploadError.errMsg || '未知错误'}`, icon: 'none' });
            // 移除失败的图片
            if (type === 'cert') {
              imageValue.value = imageValue.value.filter(img => img.url !== filePath);
            } else {
              imageValueQrCode.value = imageValueQrCode.value.filter(img => img.url !== filePath);
            }
            reject(uploadError); // 任何一个失败都拒绝
            return;
          }
        }
        resolve(uploadedUrls);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        if (err.errMsg !== 'chooseImage:fail cancel') { // 排除用户取消选择的情况
          uni.showToast({ title: '选择图片失败', icon: 'none' });
        }
        reject(err);
      }
    });
  });
}

// 选择证件图片
async function chooseCertImage() {
  try {
    const uploadedFileIds = await chooseAndUploadImage('cert', 3);
    formData.certificates = imageValue.value.map(img => img.cloudUrl).filter(url => url); // 更新 formData
  } catch (e) {
    // 错误已在 chooseAndUploadImage 中处理
  }
}

// 移除证件图片
function removeCertImage(index) {
  imageValue.value.splice(index, 1);
  formData.certificates = imageValue.value.map(img => img.cloudUrl).filter(url => url);
}

// 选择微信收款码图片
async function chooseQrCodeImage() {
  try {
    const uploadedFileIds = await chooseAndUploadImage('qrCode', 1);
    if (uploadedFileIds.length > 0) {
      formData.weChatQrCodeUrl = uploadedFileIds[0]; // 更新 formData
    } else {
      formData.weChatQrCodeUrl = '';
    }
  } catch (e) {
    // 错误已在 chooseAndUploadImage 中处理
  }
}

// 移除微信收款码图片
function removeQrCodeImage(index) {
  imageValueQrCode.value.splice(index, 1);
  formData.weChatQrCodeUrl = '';
}

// 提交申请
async function submitApplication() {
  const userInfo = uni.getStorageSync('userinfo');
  if (!userInfo || !userInfo._id) {
    return uni.showToast({ title: '请先登录', icon: 'none' });
  }
  
  // 校验必填项
  if (!formData.realName || !formData.idCard) {
    return uni.showToast({
      title: '真实姓名和身份证号为必填项',
      icon: 'none'
    });
  }

  // 校验微信收款码是否上传
  if (!formData.weChatQrCodeUrl) {
    return uni.showToast({
      title: '请上传微信收款码',
      icon: 'none'
    });
  }

  isLoading.value = true;
  uni.showLoading({ title: '正在提交...' });

  try {
    const { result } = await uniCloud.callFunction({
      name: 'applyForTechnician',
      data: {
        uid: userInfo._id,
        applicationData: formData // 包含所有表单数据，包括新的微信信息
      }
    });

    if (result.success) {
      uni.showToast({ title: '申请已提交！', icon: 'success' });
      
      // 更新本地用户状态
      userInfo.technicianApplicationStatus = 'pending';
      uni.setStorageSync('userinfo', userInfo);
      
      setTimeout(() => {
        uni.switchTab({ url: '/pages/profile/profile' });
      }, 1500);
    } else {
      throw new Error(result.message || '提交失败');
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '提交申请时发生错误',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    uni.hideLoading();
  }
}
</script>

<style lang="scss" scoped>
.apply-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
}
.form-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.form-item {
  margin-bottom: 30rpx;
}
.form-item .label {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 15rpx;
  color: #333;
}
.form-item .input {
  border: 1px solid #ddd;
  border-radius: 10rpx;
  padding: 18rpx;
  font-size: 28rpx;
}
.form-item .textarea {
  width: 100%;
  height: 200rpx;
  border: 1px solid #ddd;
  border-radius: 10rpx;
  padding: 18rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-top: 50rpx;
  margin-bottom: 10rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
}

.section-tip {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 30rpx;
  display: block;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.required-label::after {
  content: '*';
  color: #ff3b30; /* 红色星号 */
  margin-left: 8rpx;
}

.warning-text {
  font-size: 24rpx;
  color: #ff3b30; /* 红色警告文字 */
  margin-top: 10rpx;
  display: flex;
  align-items: flex-start;
  .warning-icon {
    font-weight: bold;
    margin-right: 8rpx;
    font-size: 28rpx; /* 稍微大一点的感叹号 */
  }
}

.submit-btn {
  margin-top: 60rpx;
  width: 100%;
  height: 90rpx;
  background-color: var(--themeColor, #1989fa);
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom File Picker Styles */
.custom-file-picker {
  margin-top: 10rpx;
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }
  .image-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 10rpx;
    overflow: hidden;
    border: 1rpx solid #eee;
    .uploaded-image {
      width: 100%;
      height: 100%;
    }
    .delete-btn {
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
  }
  .upload-btn {
    width: 160rpx;
    height: 160rpx;
    border: 2rpx dashed #ccc;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60rpx;
    color: #ccc;
    background-color: #f9f9f9;
    &:active {
      border-color: #007aff;
      color: #007aff;
    }
  }
}
</style>
