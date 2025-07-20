<template>
  <view class="page-container">
    <view class="form-container">
      <view class="form-title">预约服务</view>
      <view class="form-subtitle">师傅号码: {{ targetPhone }}</view>

      <view class="form-item">
        <text class="label">选择服务时间</text>
        <view class="date-selector">
          <scroll-view class="scroll-view" scroll-x="true" show-scrollbar="false">
            <view
              v-for="(day, index) in availableDays"
              :key="index"
              :class="['day-item', { 'active-day': selectedDate === day.dateString }]"
              @click="selectDate(day.dateString)"
            >
              <view class="day-name">{{ day.name }}</view>
              <view class="day-date">{{ day.shortDate }}</view>
            </view>
          </scroll-view>
        </view>
        <view class="time-slot-container">
          <view v-if="isLoading" class="loading-text">时间加载中...</view>
          <view v-else-if="timeSlots.length === 0" class="no-slots-text">暂无可用时间段</view>
          <view v-else class="time-slot-grid">
            <view
              v-for="(slot, index) in timeSlots"
              :key="index"
              :class="['time-slot-item', { 'selected-slot': selectedTime === slot.time, 'booked-slot': slot.isBooked, 'past-slot': slot.isPast }]"
              @click="selectTime(slot)"
            >
              {{ slot.time }}
            </view>
          </view>
        </view>
      </view>

  <view class="form-item">
    <text class="label">服务地点 <text class="required-star">*</text></text>
    <!-- 点击触发：小程序走地图选点，App 端走定位+逆地址 -->
    <view class="location-selector" @click="handleChooseLocation">
      <view class="location-text-wrapper">
        <text v-if="serviceAddress.name" class="location-name">{{ serviceAddress.name }}</text>
        <text v-if="serviceAddress.address" class="location-address">{{ serviceAddress.address }}</text>
        <text v-if="!serviceAddress.name" class="location-placeholder">点击选择服务地点</text>
      </view>
      <uni-icons type="location-filled" size="24" color="#999" />
    </view>
    <input
      class="detail-address-input"
      v-model="serviceAddress.detail"
      placeholder="请补充详细地址，如楼层、门牌号"
    />
  </view>

      <view class="form-item">
        <text class="label">服务需求 <text class="required-star">*</text></text>
        <textarea class="remark-textarea" v-model="remark" placeholder="请详细描述您的服务需求，例如：清洗两台挂式空调，型号为..." />
      </view>

      <view class="payment-notice">
          <view class="notice-title">
              <uni-icons type="help-filled" size="18" color="#ff9900"></uni-icons>
              <text>预约须知</text>
          </view>
          <view class="notice-content">
              <text>为保障双方权益，预约需预付30元师傅跑腿费，该费用可抵扣总服务费。</text>
              <view class="notice-list-item">  ● 若师傅取消预约，跑腿费将自动全额原路退回。</view>
              <view class="notice-list-item">  ● 用户取消退款规则：</view>
              <view class="notice-list-item">  ● 若您在服务开始前 "24小时以上" 取消，将 "全额退款"。</view>
              <view class="notice-list-item">  ● 若您在服务开始前 "12小时（含）至24小时内" 取消，将退还 "70%" 的费用。</view>
              <view class="notice-list-item">  ● 若您在服务开始前 "2小时（含）至12小时内" 取消，将退还 "50%" 的费用。</view>
              <view class="notice-list-item">  ● 服务事件开始 "1小时" 后不可取消预约。</view>
			  <view class="notice-list-item">  ● 对订单有任何争议，您可以在“我的预约”中点击“联系客服”按钮发起申诉。</view>
          </view>
      </view>

      <button class="submit-btn" @click="submitForm" :disabled="!selectedTime">
        支付并确认预约
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// --- 响应式状态定义 ---
const targetUserId = ref('');
const targetPhone = ref('');
const remark = ref('');
const userInfo = ref(uni.getStorageSync('userinfo') || {});

const availableDays = ref([]);
const timeSlots = ref([]);
const selectedDate = ref('');
const selectedTime = ref('');
const isLoading = ref(false);

// 地址相关的响应式状态
const serviceAddress = ref({
  name: '',      // 地点名称，如「XX小区」
  address: '',   // 完整地址
  latitude: null,
  longitude: null,
  detail: ''     // 手动输入的详细地址，如「A栋1201室」
});

// 腾讯地图Key
const QQ_MAP_KEY_MP = 'ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46';
const QQ_MAP_KEY_APP = '3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY';

// --- 生命周期函数 ---
onLoad((options) => {
  const { userId, accountPhoneNumber } = options;
  if (userId) {
    targetUserId.value = userId;
    targetPhone.value = accountPhoneNumber;
  } else {
    uni.showToast({ title: '缺少师傅信息', icon: 'error' });
    uni.navigateBack();
  }
});

onMounted(() => {
  generateAvailableDays();
  if (availableDays.value.length > 0) {
    selectDate(availableDays.value[0].dateString);
  }
});

watch(selectedDate, (newDate) => {
  if (newDate) {
    selectedTime.value = '';
    fetchBookedSlots(newDate);
  }
});

// --- 方法定义 ---

// 选择地点的方法
const handleChooseLocation = () => {
    uni.chooseLocation({
        latitude: serviceAddress.value.latitude || undefined,
        longitude: serviceAddress.value.longitude || undefined,
        success: (loc) => {
            let name = loc.name;
            let address = loc.address;

            if (!name && address) {
                const parts = address.split(/[,，·-]/);
                if (parts.length > 0) {
                    name = parts[0].trim();
                    address = parts.slice(1).join('').trim() || address;
                } else {
                    name = address;
                }
            } else if (name && address && address.startsWith(name)) {
                address = address.substring(name.length).trim();
            }

            serviceAddress.value = {
                ...serviceAddress.value,
                name: name,
                address: address,
                latitude: loc.latitude,
                longitude: loc.longitude
            };
        },
        fail: (err) => {
            console.error('选择地点失败', err);
            if (err.errMsg === 'chooseLocation:fail cancel' || err.errMsg === 'chooseLocation:fail') {
                uni.showToast({ title: '已取消选点', icon: 'none' });
            } else {
                uni.showToast({ title: '选点失败: ' + err.errMsg, icon: 'none' });
            }
        }
    });
};


const generateAvailableDays = () => {
  const days = [];
  const today = new Date();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayNamesShort = ['今天', '明天', '后天'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    let name = (i < 3) ? dayNamesShort[i] : dayNames[date.getDay()];
    days.push({
      name: name,
      shortDate: `${month}-${dayOfMonth}`,
      dateString: `${year}-${month}-${dayOfMonth}`,
    });
  }
  availableDays.value = days;
};

const generateStandardTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 18; i++) {
    slots.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      isBooked: false,
      isPast: false,
    });
  }
  return slots;
};

const selectDate = (dateString) => {
  selectedDate.value = dateString;
};

const fetchBookedSlots = async (date) => {
  if (!targetUserId.value) return;
  isLoading.value = true;
  timeSlots.value = [];
  try {
    const res = await uniCloud.callFunction({
      name: 'getAppointmentsByWorker',
      data: { workerId: targetUserId.value, date: date },
    });
    const bookedHours = res.result.data || [];
    const standardSlots = generateStandardTimeSlots();
    const today = new Date();
    const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const currentHour = today.getHours();
    timeSlots.value = standardSlots.map(slot => {
      const slotHour = parseInt(slot.time.split(':')[0]);
      const isPast = (date === todayString && slotHour <= currentHour);
      return {
        ...slot,
        isBooked: bookedHours.includes(slot.time),
        isPast: isPast,
      };
    });
  } catch (error) {
    console.error('获取预约时段失败:', error);
    uni.showToast({ title: '加载时间失败', icon: 'none' });
    timeSlots.value = generateStandardTimeSlots();
  } finally {
    isLoading.value = false;
  }
};

const selectTime = (slot) => {
  if (slot.isBooked) {
    uni.showToast({ title: '该时段已被预约', icon: 'none' });
    return;
  }
  if (slot.isPast) {
    uni.showToast({ title: '不能选择过去的时间', icon: 'none' });
    return;
  }
  selectedTime.value = slot.time;
};

const submitForm = async () => {
  // 1. 校验 (保留)
  if (!selectedTime.value) {
    return uni.showToast({ title: '请选择服务时间', icon: 'none' });
  }
  if (!serviceAddress.value.name || !serviceAddress.value.address) {
    return uni.showToast({ title: '请选择服务地点', icon: 'none' });
  }
  if (!serviceAddress.value.detail.trim()) {
    return uni.showToast({ title: '请填写详细地址', icon: 'none' });
  }
  if (!remark.value.trim()) {
    return uni.showToast({ title: '请填写具体服务需求', icon: 'none' });
  }
  if (!userInfo.value._id) {
    return uni.showToast({ title: '请先登录', icon: 'none' });
  }

  // **2. 暂时移除支付相关代码**
  // uni.showLoading({ title: '正在支付跑腿费...' });
  // try {
  //   const { code } = await uni.login({ provider: 'weixin' });
  //   const { result: openRes } = await uniCloud.callFunction({
  //     name: 'getOpenidByCode',
  //     data: { code }
  //   });
  //   const openid = openRes.openid;

  //   const outTradeNo = 'order_' + Date.now();
  //   const total_fee = 30;
  //   const { result: payParams } = await uniCloud.callFunction({
  //     name: 'createPayOrder',
  //     data: {
  //       openid,
  //       out_trade_no: outTradeNo,
  //       total_fee: total_fee,
  //       body: '跑腿服务费30元'
  //     }
  //   });

  //   await new Promise((resolve, reject) => {
  //     uni.requestPayment({
  //       provider: 'wxpay',
  //       ...payParams,
  //       success: resolve,
  //       fail: (err) => reject(err)
  //     });
  //   });

  //   // 3. 支付成功后创建预约 (这一部分我们手动设置 orderId 和 payStatus)
  //   uni.showLoading({ title: '正在提交预约...' });
  //   const res = await uniCloud.callFunction({
  //     name: 'createAppointment',
  //     data: {
  //       workerId: targetUserId.value,
  //       workerPhone: targetPhone.value,
  //       userId: userInfo.value._id,
  //       userPhone: userInfo.value.phoneNumber,
  //       userName: userInfo.value.name || '匿名用户',
  //       serviceDate: selectedDate.value,
  //       serviceHour: selectedTime.value,
  //       serviceAddress: serviceAddress.value,
  //       remark: remark.value,
  //       orderId: outTradeNo,
  //       payStatus: 'PAID',
  //       total_fee: total_fee,
  //       clientInfo: getApp().globalData?.clientInfo || uni.getSystemInfoSync()
  //     }
  //   });
  //   uni.hideLoading();

  //   if (res.result.success) {
  //     uni.showToast({ title: '预约成功！', icon: 'success' });
  //     setTimeout(() => uni.navigateBack(), 1500);
  //   } else {
  //     uni.showToast({ title: res.result.message || '预约失败', icon: 'none' });
  //     if (res.result.code === 'SLOT_TAKEN') {
  //       fetchBookedSlots(selectedDate.value);
  //     }
  //   }
  // } catch (err) {
  //   uni.hideLoading();
  //   if (err && err.errMsg && err.errMsg.includes('requestPayment:fail')) {
  //     uni.showToast({ title: '支付未完成，预约已取消', icon: 'none' });
  //   } else {
  //     uni.showToast({ title: '网络或系统错误，请稍后重试', icon: 'none' });
  //     console.error('submitForm error:', err);
  //   }
  // }

  // **替换为直接调用 createAppointment，模拟成功支付后的行为**
  uni.showLoading({ title: '正在提交预约...' });
  try {
    // 模拟一个支付订单号和支付状态，用于测试 createAppointment
    const mockOutTradeNo = 'mock_order_' + Date.now();
    const mockTotalFee = 30; // 与之前保持一致

    const res = await uniCloud.callFunction({
      name: 'createAppointment',
      data: {
        workerId: targetUserId.value,
        workerPhone: targetPhone.value,
        userId: userInfo.value._id,
        userPhone: userInfo.value.phoneNumber,
        userName: userInfo.value.name || '匿名用户',
        serviceDate: selectedDate.value,
        serviceHour: selectedTime.value,
        serviceAddress: serviceAddress.value,
        remark: remark.value,
        orderId: mockOutTradeNo,
        payStatus: 'MOCK_PAID', // 标记为模拟支付成功
        total_fee: mockTotalFee,
        clientInfo: getApp().globalData?.clientInfo || uni.getSystemInfoSync()
      }
    });
    uni.hideLoading();

    if (res.result.success) {
      uni.showToast({ title: '预约成功！(跳过支付)', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 1500);
    } else {
      uni.showToast({ title: res.result.message || '预约失败', icon: 'none' });
      if (res.result.code === 'SLOT_TAKEN') {
        fetchBookedSlots(selectedDate.value);
      }
    }
  } catch (err) {
    uni.hideLoading();
    uni.showToast({ title: '提交预约失败，请稍后重试', icon: 'none' });
    console.error('submitForm (without payment) error:', err);
  }
};
</script>
<style scoped>
.page-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}
.form-container {
  padding: 40rpx;
  background-color: #ffffff;
}
.form-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.form-subtitle {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 40rpx;
}
.form-item {
  margin-bottom: 40rpx;
}
.label {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
  display: block;
}
.label .required-star {
  color: #ff0000;
  margin-left: 5rpx;
}
.date-selector .scroll-view {
  white-space: nowrap;
  width: 100%;
}
.day-item {
  display: inline-block;
  text-align: center;
  padding: 20rpx;
  margin-right: 20rpx;
  border: 1px solid #eee;
  border-radius: 16rpx;
  transition: all 0.3s;
  background-color: #f7f7f7;
}
.day-item.active-day {
  background-color: #30d158;
  color: #fff;
  border-color: #30d158;
}
.day-name {
  font-size: 28rpx;
  font-weight: bold;
}
.day-date {
  font-size: 24rpx;
  margin-top: 5rpx;
}
.day-item.active-day .day-name,
.day-item.active-day .day-date {
  color: #fff;
}
.time-slot-container {
  margin-top: 30rpx;
}
.loading-text, .no-slots-text {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
}
.time-slot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}
.time-slot-item {
  padding: 20rpx 10rpx;
  border: 1px solid #ddd;
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
}
.time-slot-item:active {
  transform: scale(0.95);
}
.time-slot-item.selected-slot {
  background-color: #30d158;
  color: #fff;
  border-color: #30d158;
}
.time-slot-item.booked-slot {
  background-color: #f2f2f2;
  color: #aaa;
  border-color: #e5e5e5;
  cursor: not-allowed;
  text-decoration: line-through;
}
.time-slot-item.past-slot {
  background-color: #f9f9f9;
  color: #ccc;
  border-color: #f0f0f0;
  text-decoration: line-through;
  cursor: not-allowed;
}
.remark-textarea {
  width: 100%;
  height: 150rpx;
  border: 1px solid #e5e5e5;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background-color: #fdfdfd;
}
/* 【修改】提交按钮样式，边距调整 */
.submit-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(to right, #30d158, #28a745);
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  line-height: 96rpx;
  text-align: center;
  /* margin-top: 40rpx; */ /* 由下方的 notice 盒子控制 */
  box-shadow: 0 4px 10px rgba(48, 209, 88, 0.3);
  transition: all 0.3s;
}
.submit-btn:active {
  opacity: 0.8;
}
.submit-btn[disabled] {
  background: #c8c9cc;
  color: #fff;
  box-shadow: none;
}
.location-selector {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 100rpx;
  border: 1px solid #e5e5e5;
  padding: 15rpx 20rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
  background-color: #fdfdfd;
  transition: background-color 0.2s;
}
.location-selector:active {
  background-color: #f0f0f0;
}
.location-text-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.location-placeholder {
  font-size: 28rpx;
  color: #999;
}
.location-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 5rpx;
}
.location-address {
  font-size: 24rpx;
  color: #666;
}
.detail-address-input {
  width: 100%;
  height: 88rpx;
  border: 1px solid #e5e5e5;
  padding: 0 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background-color: #fdfdfd;
  margin-top: 20rpx;
}
/* 【新增】支付提示卡片的样式 */
.payment-notice {
    background-color: #fffaf0;
    border: 1px solid #ffe5b3;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 40rpx;
    font-size: 24rpx;
    color: #666;
    line-height: 1.6;
}
.notice-title {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 10rpx;
}
.notice-title text {
    margin-left: 10rpx;
    color: #d98600;
}
.notice-content {
    padding-left: 5rpx;
}
.notice-list-item {
    margin-top: 8rpx;
    padding-left: 5rpx;
    font-size: 22rpx;
    color: #888;
}
</style>