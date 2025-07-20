<template>
  <view class="login-page">
<!--    <view class="page-header">
      <navigator class="back-btn" open-type="switchTab" url="/pages/profile/profile">
        <uni-icons type="left" size="22" color="#1c1c1e"></uni-icons>
      </navigator>
      <view class="header-title">登录 / 注册</view>
    </view> -->

    <view class="content-area">
      <view class="form-card">
        <view class="input-row">
          <uni-icons type="phone-filled" size="22" color="#8a8a8e"></uni-icons>
          <input
            class="input-field"
            v-model="loginForm.phone"
            type="number"
            placeholder="请输入手机号"
            @input="onPhoneInput"
            maxlength="11"
          />
        </view>

        <view class="input-row">
          <uni-icons type="locked-filled" size="22" color="#8a8a8e"></uni-icons>
          <input
            class="input-field"
            v-model="loginForm.code"
            type="number"
            placeholder="请输入验证码"
            maxlength="4"
            @input="onCodeInput"
          />
          <button
            class="code-btn"
            @click="sendSmsCode"
            :disabled="sendingCode || !isPhoneValid"
          >
            {{ sendingCode ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>

        <button
          class="confirm-btn"
          @click="handleLogin"
          :loading="isLoading"
        >
          登录 / 注册
        </button>
      </view>

      <view class="terms-agreement">
        <text>登录/注册即表示您已阅读并同意</text>
        <navigator url="/pages/terms/terms" class="link-text">
          《服务条款与隐私政策》
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const isLoading = ref(false); // 登录加载状态
const sendingCode = ref(false); // 验证码发送状态
const countdown = ref(0); // 验证码倒计时
let timerInterval = null; // 倒计时定时器

// 表单数据
const loginForm = reactive({
  phone: '',
  code: ''
});

// 手机号有效性校验
const isPhoneValid = computed(() => /^1\d{10}$/.test(loginForm.phone));

// 输入清理：手机号
function onPhoneInput(e) {
  loginForm.phone = e.detail.value.replace(/\D/g, '');
}

// 输入清理：验证码
function onCodeInput(e) {
  loginForm.code = e.detail.value.replace(/\D/g, '');
}

// 发送验证码
async function sendSmsCode() {
  if (!isPhoneValid.value) {
    uni.showToast({ title: '请输入有效手机号', icon: 'none' });
    return;
  }

  sendingCode.value = true;
  countdown.value = 60;
  timerInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timerInterval);
      sendingCode.value = false;
    }
  }, 1000);

  try {
    const { result } = await uniCloud.callFunction({
      name: 'sendSmsCode',
      data: { phone: loginForm.phone }
    });

    if (result.success) {
      uni.showToast({ title: '验证码已发送', icon: 'none' });
      // 开发阶段可输出验证码到控制台
      if (result.code) {
        console.log('[开发调试] 验证码:', result.code);
      }
    } else {
      throw new Error(result.errorMsg || '验证码发送失败');
    }
  } catch (err) {
    clearInterval(timerInterval);
    sendingCode.value = false;
    uni.showToast({ title: err.message || '验证码发送异常', icon: 'none' });
  }
}

// 跳转逻辑
function redirectToHomePage(userType) {
  let targetPath = '/pages/profile/profile';
  if (userType === 'admin') {
    targetPath = '/pages/profile/profile';
  } else if (userType === 'worker') {
    targetPath = '/pages/profile/profile';
  } else {
    targetPath = '/pages/profile/profile';
  }

  uni.reLaunch({
    url: targetPath,
    success: () => console.log(`[Login] 跳转成功: ${targetPath}`),
    fail: (e) => console.error(`[Login] 跳转失败: ${targetPath}`, e)
  });
}

// 登录
async function handleLogin() {
  if (!isPhoneValid.value) {
    uni.showToast({ title: '请输入有效手机号', icon: 'none' });
    return;
  }
  if (!/^\d{4}$/.test(loginForm.code)) {
    uni.showToast({ title: '请输入4位验证码', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '登录中...' });
  isLoading.value = true;

  try {
    const pushClientId = uni.getPushClientId();
    const { result } = await uniCloud.callFunction({
      name: 'loginByPhone',
      data: { phone: loginForm.phone, code: loginForm.code, pushClientId }
    });

    console.log('[Login] 登录结果:', result);

    if (result.code === 0 && result.userInfo) {
      uni.setStorageSync('userinfo', result.userInfo);
      uni.$emit('user-login');
      uni.showToast({ title: '登录成功！', icon: 'none' });
      redirectToHomePage(result.userInfo.userType);
    } else {
      uni.showToast({ title: result.errorMsg || '登录失败', icon: 'none' });
    }
  } catch (err) {
    console.error('[Login] 登录异常:', err);
    uni.showToast({ title: err.message || '登录异常', icon: 'none' });
  } finally {
    uni.hideLoading();
    isLoading.value = false;
  }
}
</script>

<style lang="scss">
/* 保持原有样式不变 */
$page-bg: #f4f4f8;
$primary-blue: #007aff;
$text-primary: #1c1c1e;
$text-secondary: #8a8a8e;
$text-placeholder: #c7c7cc;
$card-bg: #ffffff;
$border-color: #e5e5ea;

.login-page {
  background-color: $page-bg;
  min-height: 100vh;
  width: 100%;
}

.page-header {
  padding: 100rpx 30rpx 20rpx;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;

  .back-btn {
    position: absolute;
    left: 30rpx;
    top: 50%;
    transform: translateY(25%);
  }

  .header-title {
    font-size: 34rpx;
    font-weight: 600;
    color: $text-primary;
  }
}

.content-area {
  padding: 80rpx 40rpx;
}

.login-toggle {
  display: flex;
  background-color: #e9e9eb;
  border-radius: 16rpx;
  padding: 6rpx;
  margin-bottom: 50rpx;

  .toggle-option {
    flex: 1;
    padding: 18rpx 0;
    text-align: center;
    font-size: 30rpx;
    font-weight: 500;
    color: $text-secondary;
    border-radius: 12rpx;
    transition: all 0.3s ease;

    &.active {
      background-color: $card-bg;
      color: $primary-blue;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

.form-card {
  background-color: $card-bg;
  border-radius: 24rpx;
  padding: 20rpx 40rpx 50rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.05);
}

.input-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid $border-color;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-bottom-color: $primary-blue;
  }

  .uni-icons {
    margin-right: 20rpx;
  }
}

.input-field {
  flex: 1;
  font-size: 32rpx;
  color: $text-primary;
  height: 60rpx;
  line-height: 60rpx;
  background: none;
  border: none;
  outline: none;

  &::placeholder {
    color: $text-placeholder;
  }
}

.code-btn {
  font-size: 28rpx;
  font-weight: 500;
  color: $primary-blue;
  padding: 0 10rpx;
  margin: 0;
  background: none;
  border-radius: 10rpx;

  &::after {
    border: none;
  }

  &[disabled] {
    color: $text-secondary;
    background: none;
  }
}

.confirm-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  margin-top: 60rpx;
  background-color: $primary-blue;
  color: #fff;
  font-size: 34rpx;
  font-weight: 500;
  border-radius: 48rpx;
  border: none;

  &::after {
    border: none;
  }
}

.terms-agreement {
  text-align: center;
  margin-top: 60rpx;
  font-size: 26rpx;
  color: $text-secondary;

  .link-text {
    display: inline;
    color: $primary-blue;
    text-decoration: none;
  }
}
</style>