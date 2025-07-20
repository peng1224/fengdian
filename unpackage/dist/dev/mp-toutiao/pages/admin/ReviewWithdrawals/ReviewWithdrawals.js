"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ReviewWithdrawals",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const withdrawalRequests = common_vendor.ref([]);
    const showReviewModal = common_vendor.ref(false);
    const selectedRequest = common_vendor.ref(null);
    const adminRemarks = common_vendor.ref("");
    const popupVisible = common_vendor.ref(false);
    const popupMessageType = common_vendor.ref("success");
    const popupMessageText = common_vendor.ref("");
    let popupTimer = null;
    common_vendor.onMounted(() => {
      fetchWithdrawalRequests();
    });
    common_vendor.onShow(() => {
      fetchWithdrawalRequests();
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
    const fetchWithdrawalRequests = async () => {
      loading.value = true;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getAdminWithdrawalRequests",
          data: {}
        });
        if (res.result && res.result.success) {
          withdrawalRequests.value = res.result.data;
        } else {
          common_vendor.index.__f__("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:195", "获取提现申请失败:", res.result.message);
          showMessage("error", res.result.message || "获取申请失败");
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:199", "调用云函数 getAdminWithdrawalRequests 失败:", e);
        showMessage("error", "获取申请网络错误");
      } finally {
        loading.value = false;
      }
    };
    const openReviewModal = (request) => {
      selectedRequest.value = request;
      adminRemarks.value = "";
      showReviewModal.value = true;
    };
    const closeReviewModal = () => {
      showReviewModal.value = false;
      selectedRequest.value = null;
    };
    const onQrCodeError = (e) => {
      common_vendor.index.__f__("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:221", "收款码图片加载失败:", e.detail.errMsg);
      if (selectedRequest.value) {
        showMessage("info", "收款码图片加载失败，请联系工人核实");
      }
    };
    const previewQrCode = (url) => {
      if (url) {
        common_vendor.index.previewImage({
          urls: [url],
          current: url
        });
      } else {
        common_vendor.index.showToast({ title: "无收款码可预览", icon: "none" });
      }
    };
    const processWithdrawal = async (newStatus) => {
      if (!selectedRequest.value)
        return;
      const actionText = newStatus === "completed" ? "批准打款" : "拒绝提现";
      const confirmContent = newStatus === "completed" ? `确定要批准工人 ${selectedRequest.value.workerPhone} 提现 ¥${(selectedRequest.value.amount / 100).toFixed(2)} 吗？` : `确定要拒绝工人 ${selectedRequest.value.workerPhone} 的提现申请吗？`;
      const confirmRes = await common_vendor.index.showModal({
        title: `确认${actionText}`,
        content: confirmContent,
        confirmText: actionText,
        cancelText: "取消"
      });
      if (!confirmRes.confirm) {
        return;
      }
      common_vendor.index.showLoading({ title: `正在${actionText}...`, mask: true });
      const adminInfo = common_vendor.index.getStorageSync("userinfo");
      const adminId = adminInfo ? adminInfo._id : "unknown_admin";
      try {
        const res = await common_vendor.tr.callFunction({
          name: "updateWithdrawalStatusByAdmin",
          data: {
            withdrawalRequestId: selectedRequest.value._id,
            newStatus,
            adminId,
            remarks: adminRemarks.value
          }
        });
        if (res.result && res.result.success) {
          if (newStatus === "completed") {
            showMessage("success", `${actionText}成功！请立即进行微信转账。`);
          } else {
            showMessage("success", `${actionText}成功！`);
          }
          closeReviewModal();
          fetchWithdrawalRequests();
        } else {
          common_vendor.index.__f__("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:286", `${actionText}失败:`, res.result.message);
          showMessage("error", res.result.message || `${actionText}失败`);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:290", `调用云函数 updateWithdrawalStatusByAdmin 失败:`, e);
        showMessage("error", `${actionText}网络错误，请重试`);
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : withdrawalRequests.value.length === 0 ? {} : {
        c: common_vendor.f(withdrawalRequests.value, (request, k0, i0) => {
          return {
            a: common_vendor.t(request.workerName),
            b: common_vendor.t(request.workerPhone),
            c: common_vendor.t((request.amount / 100).toFixed(2)),
            d: common_vendor.t(formatTimestamp(request.requestAt)),
            e: common_vendor.t(formatWithdrawalStatus(request.status)),
            f: request._id,
            g: common_vendor.o(($event) => openReviewModal(request))
          };
        })
      }, {
        b: withdrawalRequests.value.length === 0,
        d: showReviewModal.value
      }, showReviewModal.value ? common_vendor.e({
        e: common_vendor.o(closeReviewModal),
        f: selectedRequest.value
      }, selectedRequest.value ? common_vendor.e({
        g: common_vendor.t(selectedRequest.value.workerName),
        h: common_vendor.t(selectedRequest.value.workerPhone),
        i: common_vendor.t((selectedRequest.value.amount / 100).toFixed(2)),
        j: common_vendor.t(formatTimestamp(selectedRequest.value.requestAt)),
        k: common_vendor.t(selectedRequest.value.weChatId || "未设置"),
        l: selectedRequest.value.weChatQrCodeUrl
      }, selectedRequest.value.weChatQrCodeUrl ? {
        m: selectedRequest.value.weChatQrCodeUrl,
        n: common_vendor.o(onQrCodeError),
        o: common_vendor.o(($event) => previewQrCode(selectedRequest.value.weChatQrCodeUrl))
      } : {}, {
        p: common_vendor.f(selectedRequest.value.relatedSettlementIds, (id, k0, i0) => {
          return {
            a: common_vendor.t(id),
            b: id
          };
        }),
        q: !selectedRequest.value.relatedSettlementIds || selectedRequest.value.relatedSettlementIds.length === 0
      }, !selectedRequest.value.relatedSettlementIds || selectedRequest.value.relatedSettlementIds.length === 0 ? {} : {}, {
        r: adminRemarks.value,
        s: common_vendor.o(($event) => adminRemarks.value = $event.detail.value)
      }) : {}, {
        t: common_vendor.o(($event) => processWithdrawal("rejected")),
        v: common_vendor.o(($event) => processWithdrawal("completed")),
        w: common_vendor.o(() => {
        }),
        x: common_vendor.o(closeReviewModal)
      }) : {}, {
        y: common_vendor.t(popupMessageText.value),
        z: popupVisible.value ? 1 : "",
        A: popupMessageType.value
      });
    };
  }
};
tt.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-toutiao/pages/admin/ReviewWithdrawals/ReviewWithdrawals.js.map
