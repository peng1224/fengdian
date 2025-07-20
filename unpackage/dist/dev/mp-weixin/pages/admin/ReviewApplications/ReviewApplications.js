"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "ReviewApplications",
  setup(__props) {
    const list = common_vendor.ref([]);
    async function loadPending() {
      const { result } = await common_vendor.tr.callFunction({
        name: "getPendingApplications"
      });
      if (result.success) {
        list.value = result.data;
      } else {
        common_vendor.index.showToast({ title: result.msg || "加载失败", icon: "none" });
      }
    }
    async function review(uid, action) {
      let reason = "";
      if (action === "reject") {
        const { confirm, content } = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "拒绝原因",
            placeholderText: "请输入原因",
            editable: true,
            success: resolve
          });
        });
        if (!confirm)
          return;
        reason = content;
      }
      common_vendor.index.showLoading({ title: "提交审核..." });
      try {
        const res = await common_vendor.tr.callFunction({
          name: "reviewTechnicianApplication",
          data: { uid, action, reason }
        });
        common_vendor.index.__f__("log", "at pages/admin/ReviewApplications/ReviewApplications.vue:64", "reviewTechnicianApplication 返回：", res);
        common_vendor.index.hideLoading();
        if (res.result && res.result.success) {
          common_vendor.index.showToast({ title: "操作成功", icon: "success" });
          await loadPending();
        } else {
          common_vendor.index.showToast({ title: res.result && res.result.msg || "操作失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/admin/ReviewApplications/ReviewApplications.vue:74", "调用 reviewTechnicianApplication 错误：", err);
        common_vendor.index.showToast({ title: "网络或服务异常", icon: "none" });
      }
    }
    common_vendor.onMounted(() => {
      const user = common_vendor.index.getStorageSync("userinfo") || {};
      if (user.userType !== "admin") {
        common_vendor.index.showToast({ title: "无权限访问", icon: "none" });
        common_vendor.index.reLaunch({ url: "/pages/profile/profile" });
      } else {
        loadPending();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.technicianInfo.realName),
            b: common_vendor.t(item.technicianInfo.idCard),
            c: common_vendor.t(item.technicianInfo.skills),
            d: common_vendor.f(item.technicianInfo.certificates, (c, i, i1) => {
              return {
                a: i,
                b: c
              };
            }),
            e: common_vendor.o(($event) => review(item._id, "approve"), item._id),
            f: common_vendor.o(($event) => review(item._id, "reject"), item._id),
            g: item._id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4b5c6fc7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/ReviewApplications/ReviewApplications.js.map
