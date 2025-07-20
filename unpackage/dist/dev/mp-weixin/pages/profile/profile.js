"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userinfo = common_vendor.ref({});
    common_vendor.onShow(() => {
      const info = common_vendor.index.getStorageSync("userinfo");
      userinfo.value = info && info._id ? info : {};
    });
    function goToLoginPage() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    }
    function exitLogin() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认退出？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userinfo");
            userinfo.value = {};
          }
        }
      });
    }
    function goToWithdrawalPage() {
      common_vendor.index.navigateTo({ url: "/pages/Payouts/Payouts" });
    }
    function goToWorkerHomepage() {
      common_vendor.index.navigateTo({ url: "/pages/Homepage/Homepage" });
    }
    function goToWorkerSchedule() {
      common_vendor.index.navigateTo({ url: "/pages/worker-schedule/worker-schedule" });
    }
    function goToApplyPage() {
      common_vendor.index.navigateTo({ url: "/pages/applyTechnician/applyTechnician" });
    }
    function onEditProfile() {
      common_vendor.index.navigateTo({ url: "/pages/EditProfile/EditProfile" });
    }
    function goToUserSchedule() {
      common_vendor.index.navigateTo({ url: "/pages/user-schedule/user-schedule" });
    }
    function goToReviewApplications() {
      common_vendor.index.navigateTo({ url: "/pages/admin/ReviewApplications/ReviewApplications" });
    }
    function goToReviewWithdrawals() {
      common_vendor.index.navigateTo({ url: "/pages/admin/ReviewWithdrawals/ReviewWithdrawals" });
    }
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
        a: !userinfo.value._id
      }, !userinfo.value._id ? {
        b: common_vendor.p({
          type: "paperplane-filled",
          size: "80",
          color: "#007aff"
        }),
        c: common_vendor.o(goToLoginPage)
      } : common_vendor.e({
        d: userinfo.value.avatar || "/static/images/default-avatar.png",
        e: userinfo.value.userType === "worker" && userinfo.value.technicianApplicationStatus === "approved"
      }, userinfo.value.userType === "worker" && userinfo.value.technicianApplicationStatus === "approved" ? {
        f: common_vendor.p({
          type: "auth-filled",
          color: "#ffffff",
          size: "14"
        })
      } : {}, {
        g: common_vendor.t(userinfo.value.name || "设置昵称"),
        h: common_vendor.p({
          type: "forward",
          size: "20",
          color: "#c0c4cc"
        }),
        i: common_vendor.o(onEditProfile),
        j: userinfo.value.userType === "admin"
      }, userinfo.value.userType === "admin" ? {
        k: common_vendor.p({
          type: "checkbox-filled",
          size: "24",
          color: "#ff0852"
        }),
        l: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        m: common_vendor.o(goToReviewApplications)
      } : {}, {
        n: userinfo.value.userType === "admin"
      }, userinfo.value.userType === "admin" ? {
        o: common_vendor.p({
          type: "wallet-filled",
          size: "24",
          color: "#ff0852"
        }),
        p: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        q: common_vendor.o(goToReviewWithdrawals)
      } : {}, {
        r: common_vendor.p({
          type: "calendar-filled",
          size: "24",
          color: "#ff9500"
        }),
        s: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        t: common_vendor.o(goToUserSchedule),
        v: userinfo.value.userType === "worker" && userinfo.value.technicianApplicationStatus === "approved"
      }, userinfo.value.userType === "worker" && userinfo.value.technicianApplicationStatus === "approved" ? {
        w: common_vendor.p({
          type: "person-filled",
          size: "24",
          color: "#007aff"
        }),
        x: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        y: common_vendor.o(goToWorkerHomepage),
        z: common_vendor.p({
          type: "calendar-filled",
          size: "24",
          color: "#34c759"
        }),
        A: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        B: common_vendor.o(goToWorkerSchedule),
        C: common_vendor.p({
          type: "wallet-filled",
          size: "24",
          color: "#ff9500"
        }),
        D: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        E: common_vendor.o(goToWithdrawalPage)
      } : userinfo.value.technicianApplicationStatus === "pending" ? {
        G: common_vendor.p({
          status: "loading",
          showText: false,
          color: "#999"
        })
      } : userinfo.value.technicianApplicationStatus === "rejected" ? {
        I: common_vendor.p({
          type: "close-filled",
          color: "#ff3b30",
          size: "16"
        }),
        J: common_vendor.p({
          type: "compose",
          size: "24",
          color: "#ff9500"
        }),
        K: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        L: common_vendor.o(goToApplyPage)
      } : {
        M: common_vendor.p({
          type: "plus-filled",
          size: "24",
          color: "#007aff"
        }),
        N: common_vendor.p({
          type: "forward",
          size: "18",
          color: "#c0c4cc"
        }),
        O: common_vendor.o(goToApplyPage)
      }, {
        F: userinfo.value.technicianApplicationStatus === "pending",
        H: userinfo.value.technicianApplicationStatus === "rejected",
        P: common_vendor.o(exitLogin)
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
