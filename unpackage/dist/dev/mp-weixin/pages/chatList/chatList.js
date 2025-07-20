"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const DEFAULT_AVATAR = "/static/images/avatar-placeholder.png";
const _sfc_main = {
  __name: "chatList",
  setup(__props) {
    const myPhoneNumber = common_vendor.ref("");
    const chatList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    const isFirstLoad = common_vendor.ref(true);
    let pollingTimer = null;
    common_vendor.onLoad(() => {
      const ui = common_vendor.index.getStorageSync("userinfo");
      if (!(ui == null ? void 0 : ui.phoneNumber)) {
        isLoading.value = false;
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      myPhoneNumber.value = ui.phoneNumber;
    });
    common_vendor.onShow(() => {
      if (!myPhoneNumber.value)
        return;
      if (isFirstLoad.value) {
        isLoading.value = true;
        fetchChatList().then(() => {
          isLoading.value = false;
          isFirstLoad.value = false;
        });
        fetchTotalUnreadCount();
      } else {
        fetchChatList();
        fetchTotalUnreadCount();
      }
      if (pollingTimer)
        clearInterval(pollingTimer);
      pollingTimer = setInterval(() => {
        fetchChatList();
        fetchTotalUnreadCount();
      }, 2e4);
    });
    common_vendor.onHide(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    });
    common_vendor.onUnload(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    });
    const fetchChatList = async () => {
      if (!myPhoneNumber.value)
        return;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "get-chat-list",
          data: { userPhoneNumber: myPhoneNumber.value }
        });
        if (res.result.success) {
          const newData = res.result.data.map((session) => ({
            ...session,
            unread: session.unreadCount || 0
          }));
          newData.forEach((newItem) => {
            const index = chatList.value.findIndex((item) => item.sessionId === newItem.sessionId);
            if (index !== -1) {
              chatList.value[index] = newItem;
            } else {
              chatList.value.push(newItem);
            }
          });
          chatList.value = chatList.value.filter(
            (item) => newData.some((newItem) => newItem.sessionId === item.sessionId)
          );
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatList/chatList.vue:152", "获取会话列表失败:", e);
      }
    };
    const fetchTotalUnreadCount = async () => {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "get-total-unread-count",
          data: { userPhoneNumber: myPhoneNumber.value }
        });
        if (res.result.success) {
          const total = res.result.totalUnread || 0;
          if (total > 0) {
            common_vendor.index.setTabBarBadge({
              index: 2,
              text: total > 99 ? "99+" : total.toString()
            });
          } else {
            common_vendor.index.removeTabBarBadge({ index: 2 });
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chatList/chatList.vue:174", "获取总未读数失败:", e);
      }
    };
    const getAvatarSrc = (item) => {
      return item.avatar || DEFAULT_AVATAR;
    };
    const handleAvatarError = (item) => {
      if (item.avatar !== DEFAULT_AVATAR) {
        item.avatar = DEFAULT_AVATAR;
      }
      common_vendor.index.__f__("error", "at pages/chatList/chatList.vue:191", "头像加载失败:", item.avatar);
    };
    const goToChatDetail = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/chatDetail/chatDetail?sessionId=${item.sessionId}&name=${encodeURIComponent(item.name)}`
      });
    };
    const formatTime = (timestamp) => {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(startOfToday.getTime() - 864e5);
      if (date >= startOfToday) {
        return date.toTimeString().slice(0, 5);
      } else if (date >= startOfYesterday) {
        return "昨天";
      } else {
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${date.getFullYear()}/${m}/${d}`;
      }
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: "蜂点到家 - 本地靠谱的家政技工平台",
        path: "/pages/index/index"
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "蜂点到家 - 快速预约本地服务"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoading.value
      }, isLoading.value ? {
        b: common_vendor.f(3, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : chatList.value.length > 0 ? {
        d: common_vendor.f(chatList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: getAvatarSrc(item),
            b: common_vendor.o(($event) => handleAvatarError(item), item.sessionId),
            c: common_vendor.t(item.name),
            d: common_vendor.t(formatTime(item.lastTime)),
            e: common_vendor.t(item.lastMessage),
            f: item.unread > 0
          }, item.unread > 0 ? {
            g: common_vendor.t(item.unread > 99 ? "99+" : item.unread)
          } : {}, {
            h: item.sessionId,
            i: common_vendor.o(($event) => goToChatDetail(item), item.sessionId)
          });
        })
      } : {
        e: common_assets._imports_0$1
      }, {
        c: chatList.value.length > 0
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ee09427d"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatList/chatList.js.map
