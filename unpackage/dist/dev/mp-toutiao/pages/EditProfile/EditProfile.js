"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "EditProfile",
  setup(__props) {
    const name = common_vendor.ref("");
    const avatarOld = common_vendor.ref("");
    const avatarTemp = common_vendor.ref("");
    const avatarNewFileID = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const isWorker = common_vendor.ref(false);
    const weChatId = common_vendor.ref("");
    const weChatQrCodeUrlOld = common_vendor.ref("");
    const weChatQrCodeTemp = common_vendor.ref("");
    const weChatQrCodeNewFileID = common_vendor.ref("");
    const isUploadingQrCode = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      var _a, _b;
      let user = common_vendor.index.getStorageSync("userinfo") || {};
      common_vendor.index.__f__("log", "at pages/EditProfile/EditProfile.vue:85", "EditProfile - onMounted: 初始本地 userinfo:", user);
      if (user._id) {
        try {
          const { result } = await common_vendor.tr.callFunction({
            name: "getUserInfoById",
            // 调用新的云函数
            data: { userId: user._id }
          });
          if (result.success && result.data) {
            user = result.data;
            common_vendor.index.setStorageSync("userinfo", user);
            common_vendor.index.__f__("log", "at pages/EditProfile/EditProfile.vue:98", "EditProfile - onMounted: 已从云端获取最新 userinfo 并更新本地缓存:", user);
          } else {
            common_vendor.index.__f__("warn", "at pages/EditProfile/EditProfile.vue:100", "EditProfile - onMounted: 从云端获取用户数据失败:", result.message);
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/EditProfile/EditProfile.vue:104", "EditProfile - onMounted: 调用 getUserInfoById 云函数异常:", err);
        }
      }
      name.value = user.name || "";
      avatarOld.value = user.avatar || "";
      if (user.userType === "worker" && user.technicianApplicationStatus === "approved") {
        isWorker.value = true;
        weChatId.value = ((_a = user.technicianInfo) == null ? void 0 : _a.weChatId) || "";
        weChatQrCodeUrlOld.value = ((_b = user.technicianInfo) == null ? void 0 : _b.weChatQrCodeUrl) || "";
      } else {
        isWorker.value = false;
      }
    });
    function chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          avatarTemp.value = res.tempFilePaths[0];
          avatarNewFileID.value = "";
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/EditProfile/EditProfile.vue:134", "选择头像失败:", err);
          common_vendor.index.showToast({ title: "选择头像失败", icon: "none" });
        }
      });
    }
    async function chooseQrCode() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          weChatQrCodeTemp.value = res.tempFilePaths[0];
          weChatQrCodeNewFileID.value = "";
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/EditProfile/EditProfile.vue:151", "选择收款码失败:", err);
          common_vendor.index.showToast({ title: "选择收款码失败", icon: "none" });
        }
      });
    }
    function removeQrCode() {
      weChatQrCodeTemp.value = "";
      weChatQrCodeNewFileID.value = "";
      weChatQrCodeUrlOld.value = "";
    }
    async function submitProfile() {
      if (!name.value.trim()) {
        return common_vendor.index.showToast({ title: "姓名不能为空", icon: "none" });
      }
      if (isWorker.value && !weChatQrCodeTemp.value && !weChatQrCodeUrlOld.value) {
        return common_vendor.index.showToast({ title: "请上传微信收款码", icon: "none" });
      }
      const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
      const phoneNumber = userInfo.phoneNumber;
      if (!phoneNumber) {
        return common_vendor.index.showToast({ title: "缺少用户标识符", icon: "none" });
      }
      isLoading.value = true;
      common_vendor.index.showLoading({ title: "保存中..." });
      try {
        if (avatarTemp.value) {
          const cloudPath = `User-Avatar/${Date.now()}.jpg`;
          const uploadRes = await common_vendor.tr.uploadFile({
            cloudPath,
            filePath: avatarTemp.value
          });
          if (!uploadRes.fileID) {
            throw new Error("头像上传失败");
          }
          avatarNewFileID.value = uploadRes.fileID;
        }
        if (isWorker.value && weChatQrCodeTemp.value) {
          isUploadingQrCode.value = true;
          const cloudPathQr = `Worker-QrCodes/${userInfo._id}_${Date.now()}.png`;
          const uploadQrRes = await common_vendor.tr.uploadFile({
            cloudPath: cloudPathQr,
            filePath: weChatQrCodeTemp.value
          });
          if (!uploadQrRes.fileID) {
            throw new Error("收款码上传失败");
          }
          weChatQrCodeNewFileID.value = uploadQrRes.fileID;
          isUploadingQrCode.value = false;
        }
        const dataToSend = {
          phoneNumber,
          name: name.value,
          avatar: avatarNewFileID.value || "",
          // 新头像 ID 或空字符串
          oldAvatarFileID: avatarOld.value || "",
          // 旧头像 ID，用于云端删除
          // 工人专属数据
          isWorker: isWorker.value,
          // 告诉云函数是否是工人
          weChatId: isWorker.value ? weChatId.value : "",
          // 仅工人身份时发送微信号
          weChatQrCodeUrl: isWorker.value ? weChatQrCodeNewFileID.value || weChatQrCodeUrlOld.value || "" : "",
          // 新收款码 ID，或旧的，或空
          oldWeChatQrCodeUrl: isWorker.value ? weChatQrCodeUrlOld.value : ""
          // 旧收款码 ID，用于云端删除
        };
        const { result } = await common_vendor.tr.callFunction({
          name: "updateUserProfile",
          // 这个云函数需要被更新以处理工人信息
          data: dataToSend
        });
        if (result.code !== 200 || !result.success) {
          throw new Error(result.msg || "云函数返回错误");
        }
        common_vendor.index.setStorageSync("userinfo", result.data);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 800);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/EditProfile/EditProfile.vue:246", "更新过程出错:", err);
        common_vendor.index.hideLoading();
        isLoading.value = false;
        isUploadingQrCode.value = false;
        common_vendor.index.showToast({ title: err.message || "更新失败，请重试", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: avatarTemp.value || avatarOld.value || "/static/images/default-avatar.png",
        b: common_vendor.o(chooseAvatar),
        c: name.value,
        d: common_vendor.o(($event) => name.value = $event.detail.value),
        e: isWorker.value
      }, isWorker.value ? common_vendor.e({
        f: weChatId.value,
        g: common_vendor.o(($event) => weChatId.value = $event.detail.value),
        h: weChatQrCodeTemp.value || weChatQrCodeUrlOld.value
      }, weChatQrCodeTemp.value || weChatQrCodeUrlOld.value ? {
        i: weChatQrCodeTemp.value || weChatQrCodeUrlOld.value,
        j: common_vendor.o(removeQrCode)
      } : {
        k: common_vendor.o(chooseQrCode)
      }, {
        l: isUploadingQrCode.value
      }, isUploadingQrCode.value ? {} : {}) : {}, {
        m: common_vendor.o(submitProfile),
        n: isLoading.value || isUploadingQrCode.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f1aa6899"]]);
tt.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/EditProfile/EditProfile.js.map
