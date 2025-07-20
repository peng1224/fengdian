"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/previewList/previewList.js";
  "./pages/chatList/chatList.js";
  "./pages/profile/profile.js";
  "./pages/Homepage/Homepage.js";
  "./pages/EditProfile/EditProfile.js";
  "./pages/login/login.js";
  "./pages/terms/terms.js";
  "./pages/HomepageDetail/HomepageDetail.js";
  "./pages/chatDetail/chatDetail.js";
  "./pages/applyTechnician/applyTechnician.js";
  "./pages/admin/ReviewApplications/ReviewApplications.js";
  "./pages/appointmentForm/appointmentForm.js";
  "./pages/worker-schedule/worker-schedule.js";
  "./pages/user-schedule/user-schedule.js";
  "./pages/newsDetail/newsDetail.js";
  "./pages/allComments/allComments.js";
  "./pages/Payouts/Payouts.js";
  "./pages/admin/ReviewWithdrawals/ReviewWithdrawals.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    let pollingTimer = null;
    const safeSetTabBarBadge = (total) => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const tabBarRoutes = [
        "pages/index/index",
        "pages/previewList/previewList",
        "pages/chatList/chatList",
        "pages/profile/profile"
      ];
      if (!tabBarRoutes.includes(currentPage.route))
        return;
      try {
        if (total > 0) {
          common_vendor.index.setTabBarBadge({
            index: 2,
            text: total > 99 ? "99+" : total.toString()
          });
        } else {
          common_vendor.index.removeTabBarBadge({ index: 2 });
        }
      } catch (e) {
        common_vendor.index.__f__("warn", "at App.vue:34", "[Global Polling] 设置/移除 TabBarBadge 失败:", e);
      }
    };
    const fetchTotalUnreadCount = async (phoneNumber) => {
      if (!phoneNumber)
        return;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "get-total-unread-count",
          data: { userPhoneNumber: phoneNumber }
        });
        if (res.result.success) {
          safeSetTabBarBadge(res.result.totalUnread || 0);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:52", "[Global Polling] 获取总未读数失败:", error);
      }
    };
    const syncUserInfo = async () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!(userInfo == null ? void 0 : userInfo._id))
        return;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getUserInfo",
          data: { userId: userInfo._id }
        });
        if (res.result.code === 0 && res.result.userInfo) {
          common_vendor.index.setStorageSync("userinfo", res.result.userInfo);
          common_vendor.index.__f__("log", "at App.vue:69", "[SyncUserInfo] 已同步最新 userInfo");
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at App.vue:72", "[SyncUserInfo] 同步失败:", e);
      }
    };
    const startPolling = () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      const phone = userInfo == null ? void 0 : userInfo.phoneNumber;
      if (!phone)
        return;
      fetchTotalUnreadCount(phone);
      pollingTimer = setInterval(() => fetchTotalUnreadCount(phone), 45e3);
    };
    const stopPolling = () => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    };
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:99", "App 启动");
      startPolling();
    });
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at App.vue:104", "App 显示");
      await syncUserInfo();
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (userInfo == null ? void 0 : userInfo.phoneNumber) {
        if (!pollingTimer) {
          startPolling();
        } else {
          fetchTotalUnreadCount(userInfo.phoneNumber);
        }
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:119", "App 隐藏");
      stopPolling();
    });
    common_vendor.index.$on("user-login", () => {
      stopPolling();
      startPolling();
    });
    common_vendor.index.$on("user-logout", () => {
      stopPolling();
    });
    common_vendor.index.$on("refresh-unread", () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (userInfo == null ? void 0 : userInfo.phoneNumber) {
        fetchTotalUnreadCount(userInfo.phoneNumber);
      }
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
