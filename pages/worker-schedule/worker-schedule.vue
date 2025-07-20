<template>
	<view class="page-container">
		<!-- 日期选择器 -->
		<view class="date-selector-container">
			<scroll-view class="scroll-view" scroll-x="true" show-scrollbar="false" :scroll-into-view="scrollIntoViewId">
				<view
					v-for="(day, index) in availableDays"
					:key="index"
					:id="day.id"
					class="day-item"
					:class="{ 'active-day': selectedDate === day.dateString }"
					@click="selectDate(day.dateString)"
				>
					<view class="day-name">{{ day.name }}</view>
					<view class="day-date">{{ day.shortDate }}</view>
				</view>
			</scroll-view>
		</view>

		<!-- 时间段容器 -->
		<view class="time-slot-container">
			<view v-if="isLoading" class="loading-container">
				<uni-load-more status="loading"></uni-load-more>
			</view>
			
			<view v-else-if="timeSlots.length === 0" class="empty-container">
				<image src="/static/images/empty-box.png" class="empty-image"></image>
				<text class="empty-text">当日暂无预约</text>
			</view>
			
			<view v-else class="time-slot-grid">
				<view
					v-for="(slot, index) in timeSlots"
					:key="index"
					class="time-slot-item"
					:class="{
						'booked-slot': slot.isConfirmed,
						'completed-slot': slot.isCompleted,
						'cancelled-slot': slot.isCancelled,
						'past-slot': slot.isPast && !slot.isBooked,
					}"
					@click="selectTimeSlot(slot)"
				>
					<text class="time-text">{{ slot.time }}</text>
					<text v-if="slot.isBooked" class="booked-badge"
						:class="{
							'completed-badge': slot.isCompleted,
							'cancelled-badge': slot.isCancelled
						}">
						{{
							slot.isCompleted ? '已完成' :
							slot.isCancelled ? '已取消' : '已预约'
						}}
					</text>
				</view>
			</view>
		</view>

		<!-- 预约详情弹窗 -->
		<view v-if="selectedAppointment" class="modal-mask" @click="closeModal">
			<view class="modal-container" @click.stop>
				<view class="modal-header">
					<text class="modal-title">预约详情</text>
				</view>
				
				<view class="modal-content">
					<view class="detail-item">
						<uni-icons type="calendar" size="20" color="#666" />
						<text class="detail-label">服务时间：</text>
						<text class="detail-value">{{ selectedAppointment.serviceDate }} {{ selectedAppointment.serviceHour }}</text>
					</view>
					<view class="detail-item">
						<uni-icons type="person" size="20" color="#666" />
						<text class="detail-label">客户姓名：</text>
						<text class="detail-value">{{ selectedAppointment.userName }}</text>
					</view>
					<view class="detail-item">
						<uni-icons type="phone" size="20" color="#666" />
						<text class="detail-label">联系电话：</text>
						<text class="detail-value phone" @click="makePhoneCall(selectedAppointment.userPhone)">
							{{ selectedAppointment.userPhone }}
						</text>
					</view>

					<view class="detail-item" v-if="selectedAppointment.serviceAddress">
						<uni-icons type="location" size="20" color="#666" />
						<text class="detail-label">服务地址：</text>
						<text class="detail-value address-text">{{ selectedAppointment.serviceAddress.address }}{{ selectedAppointment.serviceAddress.detail }}</text>
						<button class="nav-btn" @click.stop="navigateToLocation(selectedAppointment.serviceAddress)">导航</button>
					</view>

					<view class="detail-item">
						<uni-icons type="chat" size="20" color="#666" />
						<text class="detail-label">服务需求：</text>
					</view>
					<view class="remark-container">
						<text class="remark-text">{{ selectedAppointment.remark }}</text>
					</view>
				</view>
				
				<view class="modal-footer">
					<button v-if="selectedAppointment.status === 'confirmed'" class="action-btn cancel-btn" @click="handleCancel(selectedAppointment)">取消此预约</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const availableDays = ref([]);
const timeSlots = ref([]);
const selectedDate = ref('');
const isLoading = ref(false);
const appointments = ref([]);
const selectedAppointment = ref(null);
const scrollIntoViewId = ref('');

onShow(() => {
	const userInfo = uni.getStorageSync('userinfo');
	if (!userInfo || !userInfo._id) {
		 uni.showToast({ title: '请先登录', icon: 'none' });
		 uni.navigateTo({ url: '/pages/login/login' });
		 return;
	}

	if (availableDays.value.length === 0) {
		generateAvailableDays();
		
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const dd = String(today.getDate()).padStart(2, '0');
		const todayDateString = `${yyyy}-${mm}-${dd}`;
		
		selectDate(todayDateString);

		nextTick(() => {
			const todayItem = availableDays.value.find(day => day.dateString === todayDateString);
			if (todayItem) {
				scrollIntoViewId.value = todayItem.id;
			}
		});

	} else {
		fetchAppointmentsForDate(selectedDate.value);
	}
});

const generateAvailableDays = () => {
	const days = [];
	const today = new Date();
	const specialNames = {
		'-2': '前天',
		'-1': '昨天',
		'0': '今天',
		'1': '明天',
		'2': '后天'
	};
	const weekNames = ['周日','周一','周二','周三','周四','周五','周六'];
	
	for (let i = -4; i <= 4; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		const dateString = `${yyyy}-${mm}-${dd}`;

		days.push({
			name: specialNames[i] || weekNames[d.getDay()],
			shortDate: `${mm}-${dd}`,
			dateString: dateString,
			id: 'day' + dateString.replace(/-/g, '')
		});
	}
	availableDays.value = days;
};

const generateStandardTimeSlots = () => {
	const slots = [];
	for (let i = 9; i <= 18; i++) {
		slots.push({ time: `${String(i).padStart(2,'0')}:00`, isBooked: false, isPast: false, isCancelled: false, appointment: null });
	}
	return slots;
};

const selectDate = async (dateString) => {
	selectedDate.value = dateString;
	await fetchAppointmentsForDate(dateString);
};

const fetchAppointmentsForDate = async (date) => {
	isLoading.value = true;
	timeSlots.value = [];
	try {
		const userInfo = uni.getStorageSync('userinfo') || {};
		const workerId = userInfo._id;
		if (!workerId) throw new Error('无法获取师傅ID，请重新登录');
		
		const res = await uniCloud.callFunction({
			name: 'getAppointmentsForWorker',
			data: { workerId, date }
		});

		if (res.result.success) {
			appointments.value = res.result.data;
			updateTimeSlots(date);
		} else {
			throw new Error(res.result.message || '加载预约失败');
		}
	} catch (err) {
		console.error(err);
		uni.showToast({ title: err.message, icon: 'none' });
		timeSlots.value = generateStandardTimeSlots();
	} finally {
		isLoading.value = false;
	}
};

/**
 * 【关键修改】更新时间段状态的逻辑
 */
const updateTimeSlots = (date) => {
	const now = new Date();
	const todayStr = now.toISOString().slice(0, 10);
	const currentHour = now.getHours();
	
	timeSlots.value = generateStandardTimeSlots().map(slot => {
		const h = parseInt(slot.time.split(':')[0]);
		const isPast = (date < todayStr) || (date === todayStr && h < currentHour);

		// 【修复】从 find 改为 filter，获取该时间段的所有预约记录
		const appsForSlot = appointments.value.filter(a => a.serviceHour === slot.time);

		// 【修复】实现状态优先级：confirmed > completed > cancelled
		// 1. 优先查找 'confirmed' 状态的预约
		let app = appsForSlot.find(a => a.status === 'confirmed');
		// 2. 如果没有 'confirmed'，再查找 'completed' 状态的
		if (!app) {
			app = appsForSlot.find(a => a.status === 'completed');
		}
		// 3. 如果都没有，则使用找到的第一个（此时应为 cancelled 状态）
		if (!app) {
			app = appsForSlot[0];
		}

		const status = app ? app.status : 'available';
		const isBooked = !!app;
		const isConfirmed = status === 'confirmed';
		const isCompleted = status === 'completed';
		const isCancelled = status === 'cancelled_by_user' || status === 'cancelled_by_worker';

		return {
			...slot,
			isBooked,
			isPast,
			appointment: app, // 绑定具有最高优先级的预约记录
			isConfirmed,
			isCompleted,
			isCancelled
		};
	});
};

const selectTimeSlot = slot => {
	if (!slot.isBooked) return;
	selectedAppointment.value = slot.appointment;
};

const handleCancel = (appointment) => {
	uni.showModal({
		title: '取消预约',
		editable: true,
		placeholderText: '请输入取消原因（必填）',
		success: async (res) => {
			if (res.confirm) {
				const reason = res.content;
				if (!reason.trim()) {
					uni.showToast({ title: '必须填写取消原因', icon: 'none' });
					return;
				}
				
				uni.showLoading({ title: '正在提交...' });
				try {
					const userInfo = uni.getStorageSync('userinfo') || {};
					const workerPhone = userInfo.phoneNumber;

					const cancelRes = await uniCloud.callFunction({
						name: 'cancelAppointmentByWorker',
						data: { 
							appointmentId: appointment._id,
							workerPhone: workerPhone,
							cancellationReason: reason
						}
					});

					uni.hideLoading();
					if (cancelRes.result.success) {
						uni.showToast({ title: '取消成功', icon: 'success' });
						closeModal();
						fetchAppointmentsForDate(selectedDate.value);
					} else {
						throw new Error(cancelRes.result.message || '取消失败');
					}
				} catch (error) {
					uni.hideLoading();
					uni.showToast({ title: error.message, icon: 'none' });
				}
			}
		}
	});
};

const closeModal = () => {
	selectedAppointment.value = null;
};

const makePhoneCall = num => uni.makePhoneCall({ phoneNumber: num });

const navigateToLocation = (serviceAddress) => {
	if (!serviceAddress || !serviceAddress.latitude || !serviceAddress.longitude) {
		uni.showToast({
			title: '地址信息不完整',
			icon: 'none'
		});
		return;
	}
	uni.openLocation({
		latitude: serviceAddress.latitude,
		longitude: serviceAddress.longitude,
		name: serviceAddress.name,
		address: serviceAddress.address + serviceAddress.detail,
		fail: (err) => {
			uni.showToast({
				title: '打开地图失败',
				icon: 'none'
			});
			console.error('uni.openLocation failed:', err);
		}
	});
};
</script>

<style scoped lang="scss">
.page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f8f8f8;
	padding: 20rpx;
}

.date-selector-container {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

	.scroll-view {
		white-space: nowrap;
		width: 100%;
	}

	.day-item {
		display: inline-block;
		text-align: center;
		padding: 20rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 16rpx;
		background: #f7f7f7;
		transition: all .3s;

		&.active-day {
			background: #30d158;
			color: #fff;
		}

		.day-name {
			font-size: 28rpx;
			font-weight: bold;
		}

		.day-date {
			font-size: 24rpx;
			margin-top: 5rpx;
		}
	}
}

.time-slot-container {
	flex: 1;
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

	.loading-container, .empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
		opacity: .6;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.time-slot-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
	}

	.time-slot-item {
		position: relative;
		padding: 30rpx 10rpx;
		border: 1px solid #e5e5e5;
		border-radius: 16rpx;
		text-align: center;
		font-size: 32rpx;
		background: #fff;
		transition: all .2s;

		&:active {
			transform: scale(.98);
		}
		
		&.booked-slot {
			background: #e8f5e9;
			border-color: #c8e6c9;
			color: #2e7d32;
		}
		
		&.completed-slot {
		    background: #e3f2fd;
		    border-color: #bbdefb;
		    color: #1976d2;
		}
		
		&.cancelled-slot {
			background: #ffebee;
			border-color: #ffcdd2;
			color: #c62828;
		}
		
		&.past-slot {
			background: #f5f5f5;
			color: #9e9e9e;
			border-color: #e0e0e0;
		}
	}

	.booked-badge {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		background: #30d158;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 10rpx;
		border-radius: 20rpx;

		&.completed-badge {
		    background: #90a4ae;
		}

		&.cancelled-badge {
			background: #f44336;
		}
	}
}

.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

@keyframes modal-appear {
	from {
		transform: translateY(50rpx);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.modal-container {
	width: 85%;
	max-width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 50rpx rgba(0,0,0,.2);
	animation: modal-appear .3s ease-out;

	.modal-header {
		position: relative;
		padding: 30rpx;
		text-align: center;
		border-bottom: 1rpx solid #f0f0f0;

		.modal-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.modal-content {
		padding: 30rpx;

		.detail-item {
			display: flex;
			align-items: center;
			margin-bottom: 25rpx;
		}

		.detail-label {
			font-size: 28rpx;
			color: #666;
			margin: 0 10rpx 0 15rpx;
			min-width: 140rpx;
		}

		.detail-value {
			font-size: 28rpx;
			color: #333;
			flex: 1;

			&.phone {
				color: #007aff;
				text-decoration: underline;
			}
			&.address-text {
				flex: 1;
				margin-right: 20rpx;
				line-height: 1.5;
			}
		}

		.remark-container {
			background: #f9f9f9;
			border-radius: 12rpx;
			padding: 20rpx;
			margin: 15rpx 0 30rpx;
		}

		.remark-text {
			font-size: 28rpx;
			color: #555;
			line-height: 1.6;
		}
	}

	.modal-footer {
		display: flex;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		justify-content: center;

		.action-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
		}
		.cancel-btn {
			background: #ff4d4f;
			color: #fff;
		}
	}
}

.nav-btn {
	padding: 0 25rpx;
	height: 56rpx;
	line-height: 56rpx;
	font-size: 24rpx;
	background: #007aff;
	color: #fff;
	border-radius: 28rpx;
	margin: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: none;

	&::after {
		border: none;
	}
}
</style>
