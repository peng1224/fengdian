"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "applyTechnician",
  setup(__props) {
    const formData = common_vendor.reactive({
      realName: "",
      // 真实姓名
      idCard: "",
      // 身份证号
      skills: "",
      // 技能简介
      certificates: [],
      // 存储上传后的证件图片 URL 列表
      weChatId: "",
      // 新增：微信号
      weChatQrCodeUrl: ""
      // 新增：微信收款码图片的 URL
    });
    const imageValue = common_vendor.ref([]);
    const imageValueQrCode = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    async function chooseAndUploadImage(type, limit) {
      return new Promise((resolve, reject) => {
        common_vendor.index.chooseImage({
          count: limit - (type === "cert" ? imageValue.value.length : imageValueQrCode.value.length),
          // 可选图片数量
          sizeType: ["compressed"],
          // 压缩图
          sourceType: ["album", "camera"],
          // 从相册选择或拍照
          success: async (res) => {
            const tempFilePaths = res.tempFilePaths;
            const uploadedUrls = [];
            const currentImages = type === "cert" ? imageValue.value : imageValueQrCode.value;
            const newImages = tempFilePaths.map((path) => ({ url: path, cloudUrl: "", loading: true }));
            if (type === "cert") {
              imageValue.value = [...currentImages, ...newImages];
            } else {
              imageValueQrCode.value = newImages;
            }
            for (let i = 0; i < tempFilePaths.length; i++) {
              const filePath = tempFilePaths[i];
              try {
                const uploadRes = await common_vendor.tr.uploadFile({
                  filePath,
                  cloudPath: `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`
                  // 随机文件名
                });
                uploadedUrls.push(uploadRes.fileID);
                const indexToUpdate = (type === "cert" ? imageValue.value : imageValueQrCode.value).findIndex((img) => img.url === filePath);
                if (indexToUpdate !== -1) {
                  if (type === "cert") {
                    imageValue.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                    imageValue.value[indexToUpdate].loading = false;
                  } else {
                    imageValueQrCode.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                    imageValueQrCode.value[indexToUpdate].loading = false;
                  }
                }
                common_vendor.index.__f__("log", "at pages/applyTechnician/applyTechnician.vue:158", `文件上传成功: ${uploadRes.fileID}`);
              } catch (uploadError) {
                common_vendor.index.__f__("error", "at pages/applyTechnician/applyTechnician.vue:161", `文件上传失败: ${filePath}`, uploadError);
                common_vendor.index.showToast({ title: `图片上传失败: ${uploadError.errMsg || "未知错误"}`, icon: "none" });
                if (type === "cert") {
                  imageValue.value = imageValue.value.filter((img) => img.url !== filePath);
                } else {
                  imageValueQrCode.value = imageValueQrCode.value.filter((img) => img.url !== filePath);
                }
                reject(uploadError);
                return;
              }
            }
            resolve(uploadedUrls);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/applyTechnician/applyTechnician.vue:176", "选择图片失败:", err);
            if (err.errMsg !== "chooseImage:fail cancel") {
              common_vendor.index.showToast({ title: "选择图片失败", icon: "none" });
            }
            reject(err);
          }
        });
      });
    }
    async function chooseCertImage() {
      try {
        const uploadedFileIds = await chooseAndUploadImage("cert", 3);
        formData.certificates = imageValue.value.map((img) => img.cloudUrl).filter((url) => url);
      } catch (e) {
      }
    }
    function removeCertImage(index) {
      imageValue.value.splice(index, 1);
      formData.certificates = imageValue.value.map((img) => img.cloudUrl).filter((url) => url);
    }
    async function chooseQrCodeImage() {
      try {
        const uploadedFileIds = await chooseAndUploadImage("qrCode", 1);
        if (uploadedFileIds.length > 0) {
          formData.weChatQrCodeUrl = uploadedFileIds[0];
        } else {
          formData.weChatQrCodeUrl = "";
        }
      } catch (e) {
      }
    }
    function removeQrCodeImage(index) {
      imageValueQrCode.value.splice(index, 1);
      formData.weChatQrCodeUrl = "";
    }
    async function submitApplication() {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!userInfo || !userInfo._id) {
        return common_vendor.index.showToast({ title: "请先登录", icon: "none" });
      }
      if (!formData.realName || !formData.idCard) {
        return common_vendor.index.showToast({
          title: "真实姓名和身份证号为必填项",
          icon: "none"
        });
      }
      if (!formData.weChatQrCodeUrl) {
        return common_vendor.index.showToast({
          title: "请上传微信收款码",
          icon: "none"
        });
      }
      isLoading.value = true;
      common_vendor.index.showLoading({ title: "正在提交..." });
      try {
        const { result } = await common_vendor.tr.callFunction({
          name: "applyForTechnician",
          data: {
            uid: userInfo._id,
            applicationData: formData
            // 包含所有表单数据，包括新的微信信息
          }
        });
        if (result.success) {
          common_vendor.index.showToast({ title: "申请已提交！", icon: "success" });
          userInfo.technicianApplicationStatus = "pending";
          common_vendor.index.setStorageSync("userinfo", userInfo);
          setTimeout(() => {
            common_vendor.index.switchTab({ url: "/pages/profile/profile" });
          }, 1500);
        } else {
          throw new Error(result.message || "提交失败");
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "提交申请时发生错误",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: formData.realName,
        b: common_vendor.o(($event) => formData.realName = $event.detail.value),
        c: formData.idCard,
        d: common_vendor.o(($event) => formData.idCard = $event.detail.value),
        e: formData.skills,
        f: common_vendor.o(($event) => formData.skills = $event.detail.value),
        g: common_vendor.f(imageValue.value, (image, index, i0) => {
          return {
            a: image.url,
            b: common_vendor.o(($event) => removeCertImage(index)),
            c: index
          };
        }),
        h: imageValue.value.length < 3
      }, imageValue.value.length < 3 ? {
        i: common_vendor.o(chooseCertImage)
      } : {}, {
        j: formData.weChatId,
        k: common_vendor.o(($event) => formData.weChatId = $event.detail.value),
        l: imageValueQrCode.value.length > 0
      }, imageValueQrCode.value.length > 0 ? {
        m: imageValueQrCode.value[0].url,
        n: common_vendor.o(($event) => removeQrCodeImage(0))
      } : {
        o: common_vendor.o(chooseQrCodeImage)
      }, {
        p: common_vendor.t(isLoading.value ? "提交中..." : "确认提交申请"),
        q: common_vendor.o(submitApplication),
        r: isLoading.value,
        s: isLoading.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b0c9ddc7"]]);
tt.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/applyTechnician/applyTechnician.js.map
