"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const QQ_MAP_KEY_MP = "ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46";
const QQ_MAP_KEY_APP = "3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY";
const DEFAULT_AVATAR = "/static/images/avatar-placeholder.png";
const PAGE_SIZE = 15;
const _sfc_main = {
  __name: "chatDetail",
  setup(__props) {
    const sessionId = common_vendor.ref("");
    const myPhoneNumber = common_vendor.ref("");
    const messages = common_vendor.ref([]);
    const messageInput = common_vendor.ref("");
    const scrollIntoView = common_vendor.ref("");
    const scrollViewHeight = common_vendor.ref(0);
    const keyboardHeight = common_vendor.ref(0);
    const isLoadingMore = common_vendor.ref(false);
    const noMoreMessages = common_vendor.ref(false);
    let pollingTimer = null;
    const lastMessageTimestamp = common_vendor.ref(0);
    const formatTimestamp = (ts) => {
      if (!ts)
        return "未知时间";
      const d = new Date(ts);
      if (isNaN(d.getTime()))
        return "无效时间";
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const HH = String(d.getHours()).padStart(2, "0");
      const MM = String(d.getMinutes()).padStart(2, "0");
      return `${d.getFullYear()}/${mm}/${dd} ${HH}:${MM}`;
    };
    const calcScrollHeight = () => {
      const inst = common_vendor.getCurrentInstance();
      if (!inst)
        return;
      common_vendor.index.createSelectorQuery().in(inst).select(".input-bar").boundingClientRect((rect) => {
        if (!rect)
          return;
        const winH = common_vendor.index.getSystemInfoSync().windowHeight;
        scrollViewHeight.value = winH - rect.height - keyboardHeight.value;
        scrollToBottom();
      }).exec();
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        if (messages.value.length > 0) {
          const lastMessage = messages.value[messages.value.length - 1];
          scrollIntoView.value = "msg-" + lastMessage._id;
        }
      });
    };
    const fetchInitialMessages = async () => {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "get-history-messages",
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
          scrollToBottom();
        } else {
          common_vendor.index.showToast({ title: "获取消息失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:201", "获取初始消息失败:", e);
      }
    };
    const loadMoreMessages = async () => {
      var _a, _b;
      if (isLoadingMore.value || noMoreMessages.value)
        return;
      isLoadingMore.value = true;
      try {
        const firstTs = ((_a = messages.value[0]) == null ? void 0 : _a.timestamp) || Date.now();
        const res = await common_vendor.tr.callFunction({
          name: "get-history-messages",
          data: {
            sessionId: sessionId.value,
            lastTimestamp: firstTs,
            pageSize: PAGE_SIZE
          }
        });
        if (res.result.success && res.result.data.length > 0) {
          const arr = await processMessages(res.result.data);
          const oldFirstMsgId = "msg-" + ((_b = messages.value[0]) == null ? void 0 : _b._id);
          messages.value = [...arr, ...messages.value];
          noMoreMessages.value = res.result.data.length < PAGE_SIZE;
          common_vendor.nextTick$1(() => {
            scrollIntoView.value = oldFirstMsgId;
          });
        } else {
          noMoreMessages.value = true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:231", "加载更多消息失败:", e);
      } finally {
        isLoadingMore.value = false;
      }
    };
    const processMessages = async (raw) => {
      const imgs = raw.filter((m) => m.type === "image" && m.fileUrl.startsWith("cloud://")).map((m) => m.fileUrl);
      let urlMap = {};
      if (imgs.length) {
        const tmp = await common_vendor.tr.getTempFileURL({ fileList: imgs });
        tmp.fileList.forEach((item) => {
          urlMap[item.fileID] = item.tempFileURL;
        });
      }
      return raw.map((m) => ({
        ...m,
        avatarUrl: m.avatarUrl || DEFAULT_AVATAR,
        fileUrl: m.type === "image" ? urlMap[m.fileUrl] || m.fileUrl : m.fileUrl
      }));
    };
    const pollForNewMessages = async () => {
      if (!sessionId.value || !lastMessageTimestamp.value)
        return;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "get-latest-messages",
          data: {
            sessionId: sessionId.value,
            lastTimestamp: lastMessageTimestamp.value
          }
        });
        if (res.result.success && res.result.data.length > 0) {
          const allNewMessages = res.result.data;
          const otherNewMessages = allNewMessages.filter((m) => m.sender !== myPhoneNumber.value);
          if (otherNewMessages.length > 0) {
            const uniqueNewMessages = otherNewMessages.filter(
              (newMsg) => !messages.value.some((existingMsg) => existingMsg._id === newMsg._id)
            );
            if (uniqueNewMessages.length > 0) {
              const processedMessages = await processMessages(uniqueNewMessages);
              messages.value.push(...processedMessages);
              scrollToBottom();
              markMessagesAsRead();
            }
          }
          lastMessageTimestamp.value = allNewMessages[allNewMessages.length - 1].timestamp;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:291", "轮询出错:", error);
      }
    };
    const _sendMessage = async (content) => {
      const ui = common_vendor.index.getStorageSync("userinfo") || {};
      const localMessage = {
        _id: `local_${Date.now()}`,
        type: content.type,
        sender: myPhoneNumber.value,
        avatarUrl: ui.avatar || DEFAULT_AVATAR,
        name: ui.name || "用户",
        sessionId: sessionId.value,
        timestamp: Date.now(),
        isRevoked: false,
        ...content.type === "text" ? { message: content.text } : {},
        ...content.type === "image" ? { fileUrl: content.tempPath, _tempPath: true } : {},
        ...content.type === "location" ? { location: content.location } : {}
      };
      messages.value.push(localMessage);
      scrollToBottom();
      if (content.type === "image") {
        try {
          common_vendor.index.showLoading({ title: "上传中..." });
          const uploadResult = await common_vendor.tr.uploadFile({
            filePath: content.tempPath,
            cloudPath: `chat-images/${sessionId.value}/${Date.now()}`
          });
          content.fileID = uploadResult.fileID;
          common_vendor.index.hideLoading();
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "图片上传失败", icon: "none" });
          const index = messages.value.findIndex((m) => m._id === localMessage._id);
          if (index > -1)
            messages.value.splice(index, 1);
          return;
        }
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "send-chat-message",
          data: {
            sessionId: sessionId.value,
            message: {
              type: content.type,
              sender: myPhoneNumber.value,
              avatarUrl: ui.avatar || DEFAULT_AVATAR,
              name: ui.name || "用户",
              ...content.type === "text" ? { message: content.text } : {},
              ...content.type === "image" ? { fileUrl: content.fileID } : {},
              ...content.type === "location" ? { location: content.location } : {}
            }
          }
        });
        if (res.result.success) {
          const index = messages.value.findIndex((m) => m._id === localMessage._id);
          if (index > -1) {
            messages.value[index]._id = res.result.messageId;
            if (messages.value[index]._tempPath)
              delete messages.value[index]._tempPath;
          }
        } else {
          common_vendor.index.showToast({ title: res.result.message || "发送失败", icon: "none" });
          const index = messages.value.findIndex((m) => m._id === localMessage._id);
          if (index > -1)
            messages.value.splice(index, 1);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:362", "发送消息出错:", e);
        common_vendor.index.showToast({ title: "发送异常", icon: "none" });
        const index = messages.value.findIndex((m) => m._id === localMessage._id);
        if (index > -1)
          messages.value.splice(index, 1);
      }
    };
    const sendTextMessage = () => {
      if (!messageInput.value.trim())
        return;
      _sendMessage({ type: "text", text: messageInput.value });
      messageInput.value = "";
    };
    const sendImage = async () => {
      try {
        const res = await common_vendor.index.chooseImage({ count: 1 });
        const tempPath = res.tempFilePaths[0];
        _sendMessage({ type: "image", tempPath });
      } catch (e) {
      }
    };
    const sendLocation = async () => {
      var _a, _b;
      common_vendor.index.showLoading({ title: "正在定位..." });
      try {
        let latitude, longitude;
        {
          const settingRes = await common_vendor.index.getSetting();
          if (!settingRes.authSetting["scope.userLocation"]) {
            await common_vendor.index.authorize({ scope: "scope.userLocation" });
          }
          const locRes = await common_vendor.index.getLocation({ type: "gcj02", isHighAccuracy: true });
          latitude = locRes.latitude;
          longitude = locRes.longitude;
        }
        common_vendor.index.__f__("log", "at pages/chatDetail/chatDetail.vue:425", "【sendLocation】定位结果:", latitude, longitude);
        if (latitude == null || longitude == null) {
          common_vendor.index.hideLoading();
          return common_vendor.index.showModal({
            title: "定位失败",
            content: "设备未返回定位，请检查权限或模拟器地理位置设置。",
            showCancel: false
          });
        }
        let key = "";
        key = QQ_MAP_KEY_MP;
        const { statusCode, data } = await common_vendor.index.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1/",
          method: "GET",
          data: { location: `${latitude},${longitude}`, key }
        });
        if (statusCode !== 200 || data.status !== 0) {
          throw new Error(`位置服务异常: ${data.message || "网络请求失败"}`);
        }
        const r = data.result;
        const loc = {
          latitude,
          longitude,
          name: ((_a = r.formatted_addresses) == null ? void 0 : _a.recommend) || ((_b = r.address_component) == null ? void 0 : _b.street_number) || "未知位置",
          address: r.address || "详细地址未知",
          thumbUrl: `https://apis.map.qq.com/ws/staticmap/v2/?center=${latitude},${longitude}&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${latitude},${longitude}&key=${key}`
        };
        _sendMessage({ type: "location", location: loc });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:474", "sendLocation 失败:", e);
        common_vendor.index.showToast({ title: e.message || "获取位置失败", icon: "none", duration: 3e3 });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const getMapThumbUrl = (location) => {
      const platform = common_vendor.index.getSystemInfoSync().platform;
      const key = platform === "mp-weixin" ? QQ_MAP_KEY_MP : QQ_MAP_KEY_APP;
      return `https://apis.map.qq.com/ws/staticmap/v2/?center=${location.latitude},${location.longitude}&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${location.latitude},${location.longitude}&key=${key}`;
    };
    const previewImage = (url) => {
      const urls = messages.value.filter((m) => m.type === "image" && !m.isRevoked).map((m) => m.fileUrl);
      common_vendor.index.previewImage({ current: url, urls });
    };
    const previewLocation = (loc) => {
      common_vendor.index.openLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        name: loc.name,
        address: loc.address,
        scale: 18
      });
    };
    const markMessagesAsRead = async () => {
      try {
        await common_vendor.tr.callFunction({
          name: "clear-unread-count",
          data: { sessionId: sessionId.value, userPhoneNumber: myPhoneNumber.value }
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatDetail/chatDetail.vue:513", "标记已读出错:", e);
      }
    };
    common_vendor.index.onKeyboardHeightChange((res) => {
      keyboardHeight.value = res.height;
      calcScrollHeight();
    });
    const onMessageLongPress = async (msg) => {
      if (msg.sender !== myPhoneNumber.value) {
        common_vendor.index.showToast({ title: "只能撤回自己的消息", icon: "none" });
        return;
      }
      const now = Date.now();
      if (now - msg.timestamp > 2 * 60 * 1e3) {
        common_vendor.index.showToast({ title: "消息发送超过2分钟，无法撤回", icon: "none" });
        return;
      }
      common_vendor.index.showActionSheet({
        itemList: ["撤回"],
        success: async (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.showLoading({ title: "正在撤回..." });
            try {
              const result = await common_vendor.tr.callFunction({
                name: "revoke-chat-message",
                data: { messageId: msg._id }
              });
              if (result.result.success) {
                const targetMsg = messages.value.find((m) => m._id === msg._id);
                if (targetMsg)
                  targetMsg.isRevoked = true;
                common_vendor.index.showToast({ title: "消息已撤回", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.result.message || "撤回失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.showToast({ title: "撤回失败，请稍后重试", icon: "none" });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    };
    common_vendor.onLoad(async (options) => {
      if (options.name) {
        const title = decodeURIComponent(options.name);
        common_vendor.index.setNavigationBarTitle({
          title
        });
      }
      if (!options.sessionId) {
        common_vendor.index.showToast({ title: "缺少会话ID", icon: "none", duration: 2e3 });
        setTimeout(() => common_vendor.index.switchTab({ url: "/pages/index/index" }), 2e3);
        return;
      }
      sessionId.value = options.sessionId;
      const ui = common_vendor.index.getStorageSync("userinfo");
      if (!ui || !ui.phoneNumber) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      myPhoneNumber.value = ui.phoneNumber;
      await fetchInitialMessages();
      await markMessagesAsRead();
    });
    common_vendor.onReady(() => {
      calcScrollHeight();
    });
    common_vendor.onShow(() => {
      if (pollingTimer)
        clearInterval(pollingTimer);
      pollingTimer = setInterval(pollForNewMessages, 45e3);
      markMessagesAsRead();
    });
    common_vendor.onHide(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    });
    common_vendor.onUnmounted(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
      common_vendor.index.offKeyboardHeightChange();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoadingMore.value
      }, isLoadingMore.value ? {} : {}, {
        b: common_vendor.f(messages.value, (msg, k0, i0) => {
          return common_vendor.e({
            a: msg.isSystemMessage
          }, msg.isSystemMessage ? {
            b: common_assets._imports_0$2
          } : {
            c: msg.avatarUrl,
            d: common_vendor.o(($event) => _ctx.handleAvatarError(msg), msg._id)
          }, {
            e: msg.type === "text" && !msg.isRevoked
          }, msg.type === "text" && !msg.isRevoked ? {
            f: common_vendor.t(msg.message)
          } : {}, {
            g: msg.type === "image" && !msg.isRevoked
          }, msg.type === "image" && !msg.isRevoked ? {
            h: msg.fileUrl,
            i: common_vendor.o(($event) => previewImage(msg.fileUrl), msg._id)
          } : {}, {
            j: msg.type === "location" && !msg.isRevoked
          }, msg.type === "location" && !msg.isRevoked ? {
            k: getMapThumbUrl(msg.location),
            l: common_vendor.o((...args) => _ctx.handleMapThumbError && _ctx.handleMapThumbError(...args), msg._id),
            m: common_vendor.t(msg.location.name || "位置"),
            n: common_vendor.t(msg.location.address),
            o: common_vendor.o(($event) => previewLocation(msg.location), msg._id)
          } : {}, {
            p: msg.isRevoked
          }, msg.isRevoked ? {
            q: common_vendor.t(msg.sender === myPhoneNumber.value ? "你" : "对方")
          } : {}, {
            r: common_vendor.t(formatTimestamp(msg.timestamp)),
            s: msg.isRevoked ? 1 : "",
            t: common_vendor.o(($event) => onMessageLongPress(msg), msg._id),
            v: common_vendor.n(msg.sender === myPhoneNumber.value ? "mine" : "other"),
            w: common_vendor.n({
              "system-message": msg.isSystemMessage
            }),
            x: common_vendor.n(msg.messageType ? msg.messageType : ""),
            y: msg._id,
            z: "msg-" + msg._id
          });
        }),
        c: scrollViewHeight.value + "px",
        d: scrollIntoView.value,
        e: common_vendor.o(loadMoreMessages),
        f: common_assets._imports_1,
        g: common_vendor.o(sendImage),
        h: common_assets._imports_2,
        i: common_vendor.o(sendLocation),
        j: common_vendor.o(sendTextMessage),
        k: messageInput.value,
        l: common_vendor.o(($event) => messageInput.value = $event.detail.value),
        m: common_vendor.o(sendTextMessage),
        n: keyboardHeight.value + "px"
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatDetail/chatDetail.js.map
