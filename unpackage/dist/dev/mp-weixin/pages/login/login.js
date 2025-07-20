"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const isLoading = common_vendor.ref(false);
    const sendingCode = common_vendor.ref(false);
    const countdown = common_vendor.ref(0);
    let timerInterval = null;
    const loginForm = common_vendor.reactive({
      phone: "",
      code: ""
    });
    const isPhoneValid = common_vendor.computed(() => /^1\d{10}$/.test(loginForm.phone));
    function onPhoneInput(e) {
      loginForm.phone = e.detail.value.replace(/\D/g, "");
    }
    function onCodeInput(e) {
      loginForm.code = e.detail.value.replace(/\D/g, "");
    }
    async function sendSmsCode() {
      if (!isPhoneValid.value) {
        common_vendor.index.showToast({ title: "请输入有效手机号", icon: "none" });
        return;
      }
      sendingCode.value = true;
      countdown.value = 60;
      timerInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timerInterval);
          sendingCode.value = false;
        }
      }, 1e3);
      try {
        const { result } = await common_vendor.tr.callFunction({
          name: "sendSmsCode",
          data: { phone: loginForm.phone }
        });
        if (result.success) {
          common_vendor.index.showToast({ title: "验证码已发送", icon: "none" });
          if (result.code) {
            common_vendor.index.__f__("log", "at pages/login/login.vue:116", "[开发调试] 验证码:", result.code);
          }
        } else {
          throw new Error(result.errorMsg || "验证码发送失败");
        }
      } catch (err) {
        clearInterval(timerInterval);
        sendingCode.value = false;
        common_vendor.index.showToast({ title: err.message || "验证码发送异常", icon: "none" });
      }
    }
    function redirectToHomePage(userType) {
      let targetPath = "/pages/profile/profile";
      if (userType === "admin") {
        targetPath = "/pages/profile/profile";
      } else if (userType === "worker") {
        targetPath = "/pages/profile/profile";
      } else {
        targetPath = "/pages/profile/profile";
      }
      common_vendor.index.reLaunch({
        url: targetPath,
        success: () => common_vendor.index.__f__("log", "at pages/login/login.vue:141", `[Login] 跳转成功: ${targetPath}`),
        fail: (e) => common_vendor.index.__f__("error", "at pages/login/login.vue:142", `[Login] 跳转失败: ${targetPath}`, e)
      });
    }
    async function handleLogin() {
      if (!isPhoneValid.value) {
        common_vendor.index.showToast({ title: "请输入有效手机号", icon: "none" });
        return;
      }
      if (!/^\d{4}$/.test(loginForm.code)) {
        common_vendor.index.showToast({ title: "请输入4位验证码", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "登录中..." });
      isLoading.value = true;
      try {
        const pushClientId = common_vendor.index.getPushClientId();
        const { result } = await common_vendor.tr.callFunction({
          name: "loginByPhone",
          data: { phone: loginForm.phone, code: loginForm.code, pushClientId }
        });
        common_vendor.index.__f__("log", "at pages/login/login.vue:167", "[Login] 登录结果:", result);
        if (result.code === 0 && result.userInfo) {
          common_vendor.index.setStorageSync("userinfo", result.userInfo);
          common_vendor.index.$emit("user-login");
          common_vendor.index.showToast({ title: "登录成功！", icon: "none" });
          redirectToHomePage(result.userInfo.userType);
        } else {
          common_vendor.index.showToast({ title: result.errorMsg || "登录失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:178", "[Login] 登录异常:", err);
        common_vendor.index.showToast({ title: err.message || "登录异常", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
        isLoading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "phone-filled",
          size: "22",
          color: "#8a8a8e"
        }),
        b: common_vendor.o([($event) => loginForm.phone = $event.detail.value, onPhoneInput]),
        c: loginForm.phone,
        d: common_vendor.p({
          type: "locked-filled",
          size: "22",
          color: "#8a8a8e"
        }),
        e: common_vendor.o([($event) => loginForm.code = $event.detail.value, onCodeInput]),
        f: loginForm.code,
        g: common_vendor.t(sendingCode.value ? `${countdown.value}s` : "获取验证码"),
        h: common_vendor.o(sendSmsCode),
        i: sendingCode.value || !isPhoneValid.value,
        j: common_vendor.o(handleLogin),
        k: isLoading.value
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
