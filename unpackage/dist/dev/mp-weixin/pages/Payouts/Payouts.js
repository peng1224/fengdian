"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Payouts",
  setup(__props) {
    const availableBalance = common_vendor.ref(0);
    const pendingWithdrawalAmount = common_vendor.ref(0);
    const withdrawalHistory = common_vendor.ref([]);
    const isRequesting = common_vendor.ref(false);
    const historyLoading = common_vendor.ref(true);
    const popupVisible = common_vendor.ref(false);
    const popupMessageType = common_vendor.ref("success");
    const popupMessageText = common_vendor.ref("");
    let popupTimer = null;
    const statusBarHeight = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight;
        }
      });
    });
    const formatTimestamp = (timestamp) => {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
        // 24小时制
      });
    };
    const formatWithdrawalStatus = (status) => {
      const map = {
        pending_review: "待审核",
        completed: "已打款",
        rejected: "已拒绝",
        failed: "打款失败"
      };
      return map[status] || "未知状态";
    };
    const getStatusClass = (status) => {
      switch (status) {
        case "pending_review":
          return "status-pending";
        case "completed":
          return "status-completed";
        case "rejected":
        case "failed":
          return "status-failed";
        default:
          return "";
      }
    };
    const showMessage = (type, text, duration = 2e3) => {
      if (popupTimer) {
        clearTimeout(popupTimer);
      }
      popupMessageType.value = type;
      popupMessageText.value = text;
      popupVisible.value = true;
      popupTimer = setTimeout(() => {
        popupVisible.value = false;
        popupTimer = null;
      }, duration);
    };
    const fetchBalances = async () => {
      const userinfo = common_vendor.index.getStorageSync("userinfo");
      if (!userinfo || !userinfo._id) {
        showMessage("error", "请先登录");
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getWorkerAvailableBalance",
          data: { userId: userinfo._id }
        });
        if (res.result && res.result.success) {
          availableBalance.value = res.result.availableBalance;
          pendingWithdrawalAmount.value = res.result.pendingWithdrawalAmount;
        } else {
          common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:169", "获取金额失败:", res.result.message);
          showMessage("error", res.result.message || "获取余额失败");
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:173", "调用云函数 getWorkerAvailableBalance 失败:", e);
        showMessage("error", "获取余额网络错误");
      }
    };
    const fetchWithdrawalHistory = async () => {
      historyLoading.value = true;
      const userinfo = common_vendor.index.getStorageSync("userinfo");
      if (!userinfo || !userinfo._id) {
        historyLoading.value = false;
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getWithdrawalHistory",
          data: { userId: userinfo._id }
        });
        if (res.result && res.result.success) {
          withdrawalHistory.value = res.result.data.map((record) => ({
            ...record,
            amount: record.amount / 100
            // 假设数据库存储的是分
          }));
        } else {
          common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:198", "获取提现历史失败:", res.result.message);
          showMessage("error", res.result.message || "获取历史失败");
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:202", "调用云函数 getWithdrawalHistory 失败:", e);
        showMessage("error", "获取历史网络错误");
      } finally {
        historyLoading.value = false;
      }
    };
    const requestWithdrawal = async () => {
      if (availableBalance.value <= 0) {
        showMessage("info", "当前无可提现金额");
        return;
      }
      const confirmRes = await common_vendor.index.showModal({
        title: "确认提现",
        content: `您确定要提现所有可提现金额 ¥${availableBalance.value.toFixed(2)} 吗？`,
        confirmText: "确认提现",
        cancelText: "取消"
      });
      if (!confirmRes.confirm) {
        return;
      }
      isRequesting.value = true;
      common_vendor.index.showLoading({ title: "正在提交提现申请...", mask: true });
      const userinfo = common_vendor.index.getStorageSync("userinfo");
      if (!userinfo || !userinfo._id || !userinfo.phoneNumber) {
        showMessage("error", "无法获取用户信息，请重新登录");
        isRequesting.value = false;
        common_vendor.index.hideLoading();
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "requestWorkerFullWithdrawal",
          data: {
            userId: userinfo._id,
            workerPhone: userinfo.phoneNumber
          }
        });
        if (res.result && res.result.success) {
          showMessage("success", "提现申请已提交，请等待平台审核");
          fetchBalances();
          fetchWithdrawalHistory();
        } else {
          common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:253", "提现申请失败:", res.result.message);
          showMessage("error", res.result.message || "提现申请失败");
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Payouts/Payouts.vue:257", "调用云函数 requestWorkerFullWithdrawal 失败:", e);
        showMessage("error", "提现网络错误，请重试");
      } finally {
        isRequesting.value = false;
        common_vendor.index.hideLoading();
      }
    };
    common_vendor.onMounted(() => {
      fetchBalances();
      fetchWithdrawalHistory();
    });
    common_vendor.onShow(() => {
      fetchBalances();
      fetchWithdrawalHistory();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(availableBalance.value.toFixed(2)),
        b: common_vendor.t(pendingWithdrawalAmount.value.toFixed(2)),
        c: common_vendor.t(isRequesting.value ? "正在申请..." : "一键提现"),
        d: common_vendor.o(requestWithdrawal),
        e: availableBalance.value <= 0 || isRequesting.value,
        f: historyLoading.value
      }, historyLoading.value ? {} : withdrawalHistory.value.length === 0 ? {} : {
        h: common_vendor.f(withdrawalHistory.value, (record, k0, i0) => {
          return {
            a: common_vendor.t(record.amount.toFixed(2)),
            b: common_vendor.t(formatTimestamp(record.requestAt)),
            c: common_vendor.t(formatWithdrawalStatus(record.status)),
            d: common_vendor.n(getStatusClass(record.status)),
            e: record._id
          };
        })
      }, {
        g: withdrawalHistory.value.length === 0,
        i: common_vendor.t(popupMessageText.value),
        j: popupVisible.value ? 1 : "",
        k: popupMessageType.value
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Payouts/Payouts.js.map
