<template>
  <view class="chat-container">
    <!--
      【关键修改 #1】
      - 移除 :scroll-top="scrollTop"
      - 新增 :scroll-into-view="scrollIntoView"
      - scroll-into-view 会将视图滚动到指定 id 的子元素位置，比设置 scrollTop 更可靠。
    -->
    <scroll-view
      class="message-scroll-view"
      scroll-y
      :style="{ height: scrollViewHeight + 'px' }"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
      @scrolltoupper="loadMoreMessages"
    >
      <view class="loading-more" v-if="isLoadingMore">正在加载更多...</view>

      <!-- 每条消息都拥有一个唯一的 id，用于 scroll-into-view 定位 -->
      <view
        v-for="msg in messages"
        :key="msg._id"
        :id="'msg-' + msg._id"
      >
        <view
          class="message-item"
          :class="[msg.sender === myPhoneNumber ? 'mine' : 'other', { 'system-message': msg.isSystemMessage }, msg.messageType ? msg.messageType : '']"
        >
          <image
            v-if="msg.isSystemMessage"
            class="system-icon"
            src="/static/images/appointment-time.png"
            mode="aspectFill"
          />
          <image
            v-else
            class="avatar"
            :src="msg.avatarUrl"
            mode="aspectFill"
            @error="handleAvatarError(msg)"
          />
          <view class="msg-content">
            <view
              class="bubble"
              :class="{ revoked: msg.isRevoked }"
              @longpress="onMessageLongPress(msg)"
            >
              <text v-if="msg.type === 'text' && !msg.isRevoked">{{ msg.message }}</text>
              <image
                class="msg-image"
                v-if="msg.type === 'image' && !msg.isRevoked"
                :src="msg.fileUrl"
                mode="aspectFit"
                @click="previewImage(msg.fileUrl)"
              />
              <view
                v-if="msg.type === 'location' && !msg.isRevoked"
                class="location-msg"
                @click="previewLocation(msg.location)"
              >
                <image
                  class="map-thumb"
                  :src="getMapThumbUrl(msg.location)"
                  mode="aspectFill"
                  @error="handleMapThumbError"
                />
                <view class="map-info">
                  <text class="map-title">{{ msg.location.name || '位置' }}</text>
                  <text class="map-address">{{ msg.location.address }}</text>
                </view>
              </view>
              <text
                class="revoked-text"
                v-if="msg.isRevoked"
              >{{ msg.sender === myPhoneNumber ? '你' : '对方' }}撤回了一条消息</text>
              <view class="time">{{ formatTimestamp(msg.timestamp) }}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-bar" :style="{ bottom: keyboardHeight + 'px' }">
      <image
        src="/static/images/sendImg.png"
        class="icon-btn"
        @click="sendImage"
      />
      <image
        src="/static/images/location.png"
        class="icon-btn"
        @click="sendLocation"
      />
      <input
        class="input"
        v-model="messageInput"
        placeholder="请输入消息..."
        confirm-type="send"
        @confirm="sendTextMessage"
        :adjust-position="false"
        cursor-spacing="20"
      />
      <button class="send-btn" @click="sendTextMessage">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onUnmounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { onLoad, onReady, onShow, onHide } from '@dcloudio/uni-app';

// --- 常量与配置 ---
const QQ_MAP_KEY_MP    = 'ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46';
const QQ_MAP_KEY_APP   = '3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY';
const DEFAULT_AVATAR   = '/static/images/avatar-placeholder.png';
const PAGE_SIZE        = 15;

// --- 响应式状态 ---
const sessionId        = ref('');
const myPhoneNumber    = ref('');
const messages         = ref([]);
const messageInput     = ref('');
// 【关键修改 #2】用 scrollIntoView 替代 scrollTop
const scrollIntoView   = ref('');
const scrollViewHeight = ref(0);
const keyboardHeight   = ref(0);
const isLoadingMore    = ref(false);
const noMoreMessages   = ref(false);

// --- 轮询相关 ---
let pollingTimer = null;
const lastMessageTimestamp = ref(0);

// --- 方法 ---
const formatTimestamp = ts => {
    if (!ts) return '未知时间';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '无效时间';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const MM = String(d.getMinutes()).padStart(2, '0');
    return `${d.getFullYear()}/${mm}/${dd} ${HH}:${MM}`;
};

const calcScrollHeight = () => {
    const inst = getCurrentInstance();
    if (!inst) return;
    uni.createSelectorQuery().in(inst)
        .select('.input-bar')
        .boundingClientRect(rect => {
            if (!rect) return;
            const winH = uni.getSystemInfoSync().windowHeight;
            scrollViewHeight.value = winH - rect.height - keyboardHeight.value;
            // 高度变化后也尝试滚动到底部
            scrollToBottom();
        })
        .exec();
};

/**
 * @description 【关键修改 #3】重写滚动到底部的方法
 * - 不再设置 scrollTop，而是更新 scrollIntoView 的值为最后一条消息的 ID。
 * - 使用 nextTick 确保在 DOM 更新（新消息渲染出来）之后再执行滚动。
 */
const scrollToBottom = () => {
    nextTick(() => {
        if (messages.value.length > 0) {
            const lastMessage = messages.value[messages.value.length - 1];
            scrollIntoView.value = 'msg-' + lastMessage._id;
        }
    });
};

const fetchInitialMessages = async () => {
    try {
        const res = await uniCloud.callFunction({
            name: 'get-history-messages',
            data: {
                sessionId: sessionId.value,
                lastTimestamp: Date.now(),
                pageSize: PAGE_SIZE
            }
        });
        if (res.result.success) {
            const arr = await processMessages(res.result.data);
            messages.value = arr;
            noMoreMessages.value = arr.length < PAGE_SIZE;
            if (arr.length > 0) {
                lastMessageTimestamp.value = arr[arr.length - 1].timestamp;
            } else {
                lastMessageTimestamp.value = Date.now();
            }
            // 初始加载后滚动到底部
            scrollToBottom();
        } else {
            uni.showToast({ title: '获取消息失败', icon: 'none' });
        }
    } catch (e) {
        console.error('获取初始消息失败:', e);
    }
};

const loadMoreMessages = async () => {
    if (isLoadingMore.value || noMoreMessages.value) return;
    isLoadingMore.value = true;
    try {
        const firstTs = messages.value[0]?.timestamp || Date.now();
        const res = await uniCloud.callFunction({
            name: 'get-history-messages',
            data: {
                sessionId: sessionId.value,
                lastTimestamp: firstTs,
                pageSize: PAGE_SIZE
            }
        });
        if (res.result.success && res.result.data.length > 0) {
            const arr = await processMessages(res.result.data);
            const oldFirstMsgId = 'msg-' + messages.value[0]?._id; // 记录旧的第一条消息ID
            messages.value = [...arr, ...messages.value];
            noMoreMessages.value = res.result.data.length < PAGE_SIZE;
            // 加载更多后，滚动回之前的第一条消息位置，防止跳动
            nextTick(() => {
                scrollIntoView.value = oldFirstMsgId;
            });
        } else {
            noMoreMessages.value = true;
        }
    } catch (e) {
        console.error('加载更多消息失败:', e);
    } finally {
        isLoadingMore.value = false;
    }
};

const processMessages = async raw => {
    const imgs = raw.filter(m => m.type === 'image' && m.fileUrl.startsWith('cloud://'))
                     .map(m => m.fileUrl);
    let urlMap = {};
    if (imgs.length) {
        const tmp = await uniCloud.getTempFileURL({ fileList: imgs });
        tmp.fileList.forEach(item => {
            urlMap[item.fileID] = item.tempFileURL;
        });
    }
    return raw.map(m => ({
        ...m,
        avatarUrl: m.avatarUrl || DEFAULT_AVATAR,
        fileUrl: m.type === 'image' ? (urlMap[m.fileUrl] || m.fileUrl) : m.fileUrl
    }));
};

const pollForNewMessages = async () => {
    if (!sessionId.value || !lastMessageTimestamp.value) return;
    try {
        const res = await uniCloud.callFunction({
            name: 'get-latest-messages',
            data: {
                sessionId: sessionId.value,
                lastTimestamp: lastMessageTimestamp.value
            }
        });

        // 【关键修改】在这里修正整个逻辑块
        if (res.result.success && res.result.data.length > 0) {
            const allNewMessages = res.result.data;

            // 1. 过滤出真正需要渲染到界面的、来自他人的消息
            const otherNewMessages = allNewMessages.filter(m => m.sender !== myPhoneNumber.value);

            if (otherNewMessages.length > 0) {
                // 为了防止因网络问题或逻辑意外导致重复渲染，可以增加一道保险
                const uniqueNewMessages = otherNewMessages.filter(
                    newMsg => !messages.value.some(existingMsg => existingMsg._id === newMsg._id)
                );

                if(uniqueNewMessages.length > 0) {
                    const processedMessages = await processMessages(uniqueNewMessages);
                    messages.value.push(...processedMessages);
                    scrollToBottom();
                    markMessagesAsRead();
                }
            }

            // 2. 无论如何，都用服务器返回的这批消息中最新的时间戳，来更新我们的轮询基准
            // 这能确保我们下一次轮询的起点是服务器已知的最新位置，不会再丢失消息
            lastMessageTimestamp.value = allNewMessages[allNewMessages.length - 1].timestamp;
        }
    } catch (error) {
        console.error('轮询出错:', error);
    }
};

const _sendMessage = async (content) => {
    const ui = uni.getStorageSync('userinfo') || {};
    const localMessage = {
        _id: `local_${Date.now()}`,
        type: content.type,
        sender: myPhoneNumber.value,
        avatarUrl: ui.avatar || DEFAULT_AVATAR,
        name: ui.name || '用户',
        sessionId: sessionId.value,
        timestamp: Date.now(),
        isRevoked: false,
        ...(content.type === 'text' ? { message: content.text } : {}),
        ...(content.type === 'image' ? { fileUrl: content.tempPath, _tempPath: true } : {}),
        ...(content.type === 'location' ? { location: content.location } : {})
    };

    messages.value.push(localMessage);
    // 【关键修改 #4】在消息推入数组后，立即调用新的滚动方法
    scrollToBottom();
    // lastMessageTimestamp.value = localMessage.timestamp;

    if (content.type === 'image') {
        try {
            uni.showLoading({ title: '上传中...' });
            const uploadResult = await uniCloud.uploadFile({
                filePath: content.tempPath,
                cloudPath: `chat-images/${sessionId.value}/${Date.now()}`
            });
            content.fileID = uploadResult.fileID;
            uni.hideLoading();
        } catch (e) {
            uni.hideLoading();
            uni.showToast({ title: '图片上传失败', icon: 'none' });
            const index = messages.value.findIndex(m => m._id === localMessage._id);
            if (index > -1) messages.value.splice(index, 1);
            return;
        }
    }

    try {
        const res = await uniCloud.callFunction({
            name: 'send-chat-message',
            data: {
                sessionId: sessionId.value,
                message: {
                    type: content.type,
                    sender: myPhoneNumber.value,
                    avatarUrl: ui.avatar || DEFAULT_AVATAR,
                    name: ui.name || '用户',
                    ...(content.type === 'text' ? { message: content.text } : {}),
                    ...(content.type === 'image' ? { fileUrl: content.fileID } : {}),
                    ...(content.type === 'location' ? { location: content.location } : {})
                }
            }
        });
        if (res.result.success) {
            const index = messages.value.findIndex(m => m._id === localMessage._id);
            if (index > -1) {
                messages.value[index]._id = res.result.messageId;
                if (messages.value[index]._tempPath) delete messages.value[index]._tempPath;
            }
        } else {
            uni.showToast({ title: res.result.message || '发送失败', icon: 'none' });
            const index = messages.value.findIndex(m => m._id === localMessage._id);
            if (index > -1) messages.value.splice(index, 1);
        }
    } catch (e) {
        console.error('发送消息出错:', e);
        uni.showToast({ title: '发送异常', icon: 'none' });
        const index = messages.value.findIndex(m => m._id === localMessage._id);
        if (index > -1) messages.value.splice(index, 1);
    }
};

const sendTextMessage = () => {
    if (!messageInput.value.trim()) return;
    _sendMessage({ type: 'text', text: messageInput.value });
    messageInput.value = '';
};

const sendImage = async () => {
    try {
        const res = await uni.chooseImage({ count: 1 });
        const tempPath = res.tempFilePaths[0];
        _sendMessage({ type: 'image', tempPath: tempPath });
    } catch (e) {
        // 用户取消选择
    }
};

// pages/chatDetail/chatDetail.vue

const sendLocation = async () => {
  uni.showLoading({ title: '正在定位...' });
  try {
    let latitude, longitude;

    // —— 小程序平台（微信/支付宝）走原来流程
    // #ifdef MP-WEIXIN || MP-ALIPAY
    {
      const settingRes = await uni.getSetting();
      if (!settingRes.authSetting['scope.userLocation']) {
        await uni.authorize({ scope: 'scope.userLocation' });
      }
      const locRes = await uni.getLocation({ type: 'gcj02', isHighAccuracy: true });
      latitude = locRes.latitude;
      longitude = locRes.longitude;
    }
    // #endif

    // —— 原生 App-Plus 环境：直接用 plus.geolocation 拿坐标
    // #ifdef APP-PLUS
    {
      await new Promise((resolve, reject) => {
        plus.geolocation.getCurrentPosition(
          (pos) => {
            // pos.coords 里才有真正的经纬度
            latitude  = pos.coords.latitude;
            longitude = pos.coords.longitude;
            resolve();
          },
          (err) => {
            reject(err);
          },
          { provider: 'system', geocode: false }
        );
      });
    }
    // #endif

    console.log('【sendLocation】定位结果:', latitude, longitude);

    // 如果依然拿不到，就提示并退出
    if (latitude == null || longitude == null) {
      uni.hideLoading();
      return uni.showModal({
        title: '定位失败',
        content: '设备未返回定位，请检查权限或模拟器地理位置设置。',
        showCancel: false
      });
    }

    // —— 后续逆地理解析保持不变 —— 
    let key = '';
    // #ifdef MP-WEIXIN
    key = QQ_MAP_KEY_MP;
    // #endif
    // #ifdef APP-PLUS
    key = QQ_MAP_KEY_APP;
    // #endif

    const { statusCode, data } = await uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      method: 'GET',
      data: { location: `${latitude},${longitude}`, key }
    });

    if (statusCode !== 200 || data.status !== 0) {
      throw new Error(`位置服务异常: ${data.message || '网络请求失败'}`);
    }

    const r = data.result;
    const loc = {
      latitude,
      longitude,
      name: r.formatted_addresses?.recommend
            || r.address_component?.street_number
            || '未知位置',
      address: r.address || '详细地址未知',
      thumbUrl:
        `https://apis.map.qq.com/ws/staticmap/v2/` +
        `?center=${latitude},${longitude}` +
        `&zoom=16&size=800x400` +
        `&markers=size:large|color:0x3399FF|label:D|${latitude},${longitude}` +
        `&key=${key}`,
    };
    _sendMessage({ type: 'location', location: loc });

  } catch (e) {
    console.error('sendLocation 失败:', e);
    uni.showToast({ title: e.message || '获取位置失败', icon: 'none', duration: 3000 });
  } finally {
    uni.hideLoading();
  }
};


// 在 <script setup> 中定义
const getMapThumbUrl = (location) => {
  const platform = uni.getSystemInfoSync().platform;
  const key = platform === 'mp-weixin' ? QQ_MAP_KEY_MP : QQ_MAP_KEY_APP;
  return `https://apis.map.qq.com/ws/staticmap/v2/?center=${location.latitude},${location.longitude}&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${location.latitude},${location.longitude}&key=${key}`;
};



const previewImage = url => {
    const urls = messages.value.filter(m => m.type === 'image' && !m.isRevoked).map(m => m.fileUrl);
    uni.previewImage({ current: url, urls });
};

const previewLocation = loc => {
    uni.openLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        name: loc.name,
        address: loc.address,
        scale: 18
    });
};

const markMessagesAsRead = async () => {
    try {
        await uniCloud.callFunction({
            name: 'clear-unread-count',
            data: { sessionId: sessionId.value, userPhoneNumber: myPhoneNumber.value }
        });
    } catch (e) {
        console.error('标记已读出错:', e);
    }
};

uni.onKeyboardHeightChange(res => {
    keyboardHeight.value = res.height;
    calcScrollHeight();
});

const onMessageLongPress = async (msg) => {
    if (msg.sender !== myPhoneNumber.value) {
        uni.showToast({ title: '只能撤回自己的消息', icon: 'none' });
        return;
    }
    const now = Date.now();
    if (now - msg.timestamp > 2 * 60 * 1000) {
        uni.showToast({ title: '消息发送超过2分钟，无法撤回', icon: 'none' });
        return;
    }
    uni.showActionSheet({
        itemList: ['撤回'],
        success: async (res) => {
            if (res.tapIndex === 0) {
                uni.showLoading({ title: '正在撤回...' });
                try {
                    const result = await uniCloud.callFunction({
                        name: 'revoke-chat-message',
                        data: { messageId: msg._id }
                    });
                    if (result.result.success) {
                        const targetMsg = messages.value.find(m => m._id === msg._id);
                        if (targetMsg) targetMsg.isRevoked = true;
                        uni.showToast({ title: '消息已撤回', icon: 'success' });
                    } else {
                        uni.showToast({ title: result.result.message || '撤回失败', icon: 'none' });
                    }
                } catch (e) {
                    uni.showToast({ title: '撤回失败，请稍后重试', icon: 'none' });
                } finally {
                    uni.hideLoading();
                }
            }
        }
    });
};

// --- 生命周期函数 ---
onLoad(async (options) => {
    /**
     * 【关键修改】
     * - 在页面加载时，从 options 中获取 name 参数。
     * - 使用 decodeURIComponent 解码，防止中文乱码。
     * - 调用 uni.setNavigationBarTitle 来动态设置页面标题。
     */
    if (options.name) {
        const title = decodeURIComponent(options.name);
        uni.setNavigationBarTitle({
            title: title
        });
    }

    if (!options.sessionId) {
        uni.showToast({ title: '缺少会话ID', icon: 'none', duration: 2000 });
        setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 2000);
        return;
    }
    sessionId.value = options.sessionId;
    
    const ui = uni.getStorageSync('userinfo');
    if (!ui || !ui.phoneNumber) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
    }
    myPhoneNumber.value = ui.phoneNumber;
    
    await fetchInitialMessages();
    await markMessagesAsRead();
});

onReady(() => {
    calcScrollHeight();
});

onShow(() => {
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = setInterval(pollForNewMessages, 45000);
    markMessagesAsRead();
});

onHide(() => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
});

onUnmounted(() => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
    uni.offKeyboardHeightChange();
});
</script>

<style lang="scss">
page {
  height: 100%;
}
.chat-container {
  position: relative;
  height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  overflow: hidden;
}

.message-scroll-view {
  box-sizing: border-box;
  padding-bottom: 20rpx;
}

.loading-more {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 20rpx 0;
}

.message-item {
  display: flex;
  margin: 20rpx 30rpx 40rpx;
  align-items: flex-start;

  &.mine {
    flex-direction: row-reverse;
    .msg-content {
      align-items: flex-end;
    }
    .bubble {
      background: #fff;
    }
  }

  &.system-message {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30rpx 30rpx 50rpx;

    .avatar {
      display: none;
    }

    .system-icon {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 20rpx;
      filter: brightness(1.2);
    }

    .bubble {
      background: #FFF8F2;
      color: #E65100;
      text-align: center;
      padding: 28rpx 40rpx;
      border-radius: 16rpx;
      font-size: 34rpx;
      font-weight: 500;
      box-shadow: 0 6rpx 24rpx rgba(230, 81, 0, 0.12);
      border: 1px solid rgba(230, 81, 0, 0.1);
      max-width: 90%;
      line-height: 1.5;
      transition: all 0.3s ease;
    }
  }

  &.appointment_created .bubble {
    background: #E6F7FF;
    color: #007AFF;
    border: 1px solid #91D5FF;
  }

  &.appointment_cancelled .bubble {
    background: #FFF1F0;
    color: #d71100;
    border: 1px solid #FFA39E;
  }
}

.time {
  font-size: 20rpx;
  color: #999;
  margin-top: 12rpx;
  text-align: right;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  margin: 0 20rpx;
  flex-shrink: 0;
  background-color: #eee;
}

.msg-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 120rpx - 60rpx);
}

.bubble {
  background: #fff;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  line-height: 1.5;
  word-break: break-all;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.msg-image {
  max-width: 450rpx;
  max-height: 400rpx;
  border-radius: 12rpx;
  display: block;
  background-color: #e9e9e9;
}

.location-msg {
  width: 480rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #fefefe;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);

  .map-thumb {
    width: 100%;
    height: 280rpx;
    display: block;
  }

  .map-info {
    padding: 15rpx 20rpx;
    background-color: #fff;
  }

  .map-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 8rpx;
  }

  .map-address {
    font-size: 24rpx;
    color: #777;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}


.revoked-text {
  font-size: 24rpx;
  color: #999;
}

.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 15rpx 20rpx;
  padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
  background: #f8f8f8;
  border-top: 1rpx solid #e0e0e0;
  transition: bottom 0.2s ease-out;
  z-index: 100;
  box-sizing: border-box;

  .icon-btn {
    width: 56rpx;
    height: 56rpx;
    margin: 0 10rpx;
    flex-shrink: 0;
  }

  .input {
    flex: 1;
    height: 76rpx;
    padding: 0 28rpx;
    background: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
  }

  .send-btn {
    height: 72rpx;
    padding: 0 36rpx;
    line-height: 72rpx;
    background: #000000;
    color: white;
    border-radius: 40rpx;
    font-size: 28rpx;
    margin-left: 10rpx;
    flex-shrink: 0;
  }
}
</style>
