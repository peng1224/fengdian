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
  __name: "appointmentForm",
  setup(__props) {
    const targetUserId = common_vendor.ref("");
    const targetPhone = common_vendor.ref("");
    const remark = common_vendor.ref("");
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userinfo") || {});
    const availableDays = common_vendor.ref([]);
    const timeSlots = common_vendor.ref([]);
    const selectedDate = common_vendor.ref("");
    const selectedTime = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const serviceAddress = common_vendor.ref({
      name: "",
      // 地点名称，如「XX小区」
      address: "",
      // 完整地址
      latitude: null,
      longitude: null,
      detail: ""
      // 手动输入的详细地址，如「A栋1201室」
    });
    common_vendor.onLoad((options) => {
      const { userId, accountPhoneNumber } = options;
      if (userId) {
        targetUserId.value = userId;
        targetPhone.value = accountPhoneNumber;
      } else {
        common_vendor.index.showToast({ title: "缺少师傅信息", icon: "error" });
        common_vendor.index.navigateBack();
      }
    });
    common_vendor.onMounted(() => {
      generateAvailableDays();
      if (availableDays.value.length > 0) {
        selectDate(availableDays.value[0].dateString);
      }
    });
    common_vendor.watch(selectedDate, (newDate) => {
      if (newDate) {
        selectedTime.value = "";
        fetchBookedSlots(newDate);
      }
    });
    const handleChooseLocation = async () => {
      try {
        const res = await common_vendor.index.chooseLocation({
          latitude: serviceAddress.value.latitude || void 0,
          longitude: serviceAddress.value.longitude || void 0
        });
        let name = res.name;
        let address = res.address;
        if (!name && address) {
          const addressParts = address.split(/[-·]/);
          name = addressParts[0].trim();
          address = addressParts.slice(1).join("-").trim() || address;
        } else if (!address && name) {
          address = name;
          name = name.split(/[-·]/)[0].trim();
        } else if (!name && !address) {
          common_vendor.index.showToast({ title: "无法获取地址信息，请重新选择", icon: "none" });
          return;
        }
        serviceAddress.value.name = name || "未知地点";
        serviceAddress.value.address = address || "未知地址";
        serviceAddress.value.latitude = res.latitude;
        serviceAddress.value.longitude = res.longitude;
      } catch (error) {
        if (error.errMsg && error.errMsg.includes("cancel")) {
          common_vendor.index.__f__("log", "at pages/appointmentForm/appointmentForm.vue:183", "用户取消选择地点");
        } else {
          common_vendor.index.__f__("error", "at pages/appointmentForm/appointmentForm.vue:185", "选择地点失败:", error);
          common_vendor.index.showToast({ title: "选择地点失败，请检查权限", icon: "none" });
        }
      }
    };
    const generateAvailableDays = () => {
      const days = [];
      const today = /* @__PURE__ */ new Date();
      const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const dayNamesShort = ["今天", "明天", "后天"];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const dayOfMonth = date.getDate().toString().padStart(2, "0");
        let name = i < 3 ? dayNamesShort[i] : dayNames[date.getDay()];
        days.push({
          name,
          shortDate: `${month}-${dayOfMonth}`,
          dateString: `${year}-${month}-${dayOfMonth}`
        });
      }
      availableDays.value = days;
    };
    const generateStandardTimeSlots = () => {
      const slots = [];
      for (let i = 9; i <= 18; i++) {
        slots.push({
          time: `${i.toString().padStart(2, "0")}:00`,
          isBooked: false,
          isPast: false
        });
      }
      return slots;
    };
    const selectDate = (dateString) => {
      selectedDate.value = dateString;
    };
    const fetchBookedSlots = async (date) => {
      if (!targetUserId.value)
        return;
      isLoading.value = true;
      timeSlots.value = [];
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getAppointmentsByWorker",
          data: { workerId: targetUserId.value, date }
        });
        const bookedHours = res.result.data || [];
        const standardSlots = generateStandardTimeSlots();
        const today = /* @__PURE__ */ new Date();
        const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        const currentHour = today.getHours();
        timeSlots.value = standardSlots.map((slot) => {
          const slotHour = parseInt(slot.time.split(":")[0]);
          const isPast = date === todayString && slotHour <= currentHour;
          return {
            ...slot,
            isBooked: bookedHours.includes(slot.time),
            isPast
          };
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointmentForm/appointmentForm.vue:253", "获取预约时段失败:", error);
        common_vendor.index.showToast({ title: "加载时间失败", icon: "none" });
        timeSlots.value = generateStandardTimeSlots();
      } finally {
        isLoading.value = false;
      }
    };
    const selectTime = (slot) => {
      if (slot.isBooked) {
        common_vendor.index.showToast({ title: "该时段已被预约", icon: "none" });
        return;
      }
      if (slot.isPast) {
        common_vendor.index.showToast({ title: "不能选择过去的时间", icon: "none" });
        return;
      }
      selectedTime.value = slot.time;
    };
    const submitForm = async () => {
      if (!selectedTime.value) {
        return common_vendor.index.showToast({ title: "请选择服务时间", icon: "none" });
      }
      if (!serviceAddress.value.name || !serviceAddress.value.address) {
        return common_vendor.index.showToast({ title: "请选择服务地点", icon: "none" });
      }
      if (!serviceAddress.value.detail.trim()) {
        return common_vendor.index.showToast({ title: "请填写详细地址", icon: "none" });
      }
      if (!remark.value.trim()) {
        return common_vendor.index.showToast({ title: "请填写具体服务需求", icon: "none" });
      }
      if (!userInfo.value._id) {
        return common_vendor.index.showToast({ title: "请先登录", icon: "none" });
      }
      common_vendor.index.showLoading({ title: "正在支付跑腿费..." });
      try {
        const { code } = await common_vendor.index.login({ provider: "weixin" });
        const { result: openRes } = await common_vendor.tr.callFunction({
          name: "getOpenidByCode",
          data: { code }
        });
        const openid = openRes.openid;
        const outTradeNo = "order_" + Date.now();
        const total_fee = 30;
        const { result: payParams } = await common_vendor.tr.callFunction({
          name: "createPayOrder",
          data: {
            openid,
            out_trade_no: outTradeNo,
            total_fee,
            // 使用定义的 total_fee
            body: "跑腿服务费30元"
          }
        });
        await new Promise((resolve, reject) => {
          common_vendor.index.requestPayment({
            provider: "wxpay",
            ...payParams,
            success: resolve,
            fail: (err) => reject(err)
          });
        });
        common_vendor.index.showLoading({ title: "正在提交预约..." });
        const res = await common_vendor.tr.callFunction({
          name: "createAppointment",
          data: {
            workerId: targetUserId.value,
            workerPhone: targetPhone.value,
            userId: userInfo.value._id,
            userPhone: userInfo.value.phoneNumber,
            userName: userInfo.value.name || "匿名用户",
            serviceDate: selectedDate.value,
            serviceHour: selectedTime.value,
            serviceAddress: serviceAddress.value,
            remark: remark.value,
            orderId: outTradeNo,
            // 记录支付订单号
            payStatus: "PAID",
            // 标记已支付
            total_fee
            // 使用定义的 total_fee
          }
        });
        common_vendor.index.hideLoading();
        if (res.result.success) {
          common_vendor.index.showToast({ title: "预约成功！", icon: "success" });
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        } else {
          common_vendor.index.showToast({ title: res.result.message || "预约失败", icon: "none" });
          if (res.result.code === "SLOT_TAKEN") {
            fetchBookedSlots(selectedDate.value);
          }
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        if (err && err.errMsg && err.errMsg.includes("requestPayment:fail")) {
          common_vendor.index.showToast({ title: "支付未完成，预约已取消", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: "网络或系统错误，请稍后重试", icon: "none" });
          common_vendor.index.__f__("error", "at pages/appointmentForm/appointmentForm.vue:366", "submitForm error:", err);
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(targetPhone.value),
        b: common_vendor.f(availableDays.value, (day, index, i0) => {
          return {
            a: common_vendor.t(day.name),
            b: common_vendor.t(day.shortDate),
            c: index,
            d: common_vendor.n({
              "active-day": selectedDate.value === day.dateString
            }),
            e: common_vendor.o(($event) => selectDate(day.dateString))
          };
        }),
        c: isLoading.value
      }, isLoading.value ? {} : timeSlots.value.length === 0 ? {} : {
        e: common_vendor.f(timeSlots.value, (slot, index, i0) => {
          return {
            a: common_vendor.t(slot.time),
            b: index,
            c: common_vendor.n({
              "selected-slot": selectedTime.value === slot.time,
              "booked-slot": slot.isBooked,
              "past-slot": slot.isPast
            }),
            d: common_vendor.o(($event) => selectTime(slot))
          };
        })
      }, {
        d: timeSlots.value.length === 0,
        f: serviceAddress.value.name
      }, serviceAddress.value.name ? {
        g: common_vendor.t(serviceAddress.value.name)
      } : {}, {
        h: serviceAddress.value.address
      }, serviceAddress.value.address ? {
        i: common_vendor.t(serviceAddress.value.address)
      } : {}, {
        j: !serviceAddress.value.name
      }, !serviceAddress.value.name ? {} : {}, {
        k: common_vendor.p({
          type: "location-filled",
          size: "24",
          color: "#999"
        }),
        l: common_vendor.o(handleChooseLocation),
        m: serviceAddress.value.detail,
        n: common_vendor.o(($event) => serviceAddress.value.detail = $event.detail.value),
        o: remark.value,
        p: common_vendor.o(($event) => remark.value = $event.detail.value),
        q: common_vendor.p({
          type: "help-filled",
          size: "18",
          color: "#ff9900"
        }),
        r: common_vendor.o(submitForm),
        s: !selectedTime.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-91af7e50"]]);
tt.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/appointmentForm/appointmentForm.js.map
