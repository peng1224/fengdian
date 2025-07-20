"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_load_more2 + _easycom_uni_icons2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "worker-schedule",
  setup(__props) {
    const availableDays = common_vendor.ref([]);
    const timeSlots = common_vendor.ref([]);
    const selectedDate = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const appointments = common_vendor.ref([]);
    const selectedAppointment = common_vendor.ref(null);
    const scrollIntoViewId = common_vendor.ref("");
    common_vendor.onShow(() => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!userInfo || !userInfo._id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        common_vendor.index.navigateTo({ url: "/pages/login/login" });
        return;
      }
      if (availableDays.value.length === 0) {
        generateAvailableDays();
        const today = /* @__PURE__ */ new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayDateString = `${yyyy}-${mm}-${dd}`;
        selectDate(todayDateString);
        common_vendor.nextTick$1(() => {
          const todayItem = availableDays.value.find((day) => day.dateString === todayDateString);
          if (todayItem) {
            scrollIntoViewId.value = todayItem.id;
          }
        });
      } else {
        fetchAppointmentsForDate(selectedDate.value);
      }
    });
    const generateAvailableDays = () => {
      const days = [];
      const today = /* @__PURE__ */ new Date();
      const specialNames = {
        "-2": "前天",
        "-1": "昨天",
        "0": "今天",
        "1": "明天",
        "2": "后天"
      };
      const weekNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      for (let i = -4; i <= 4; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;
        days.push({
          name: specialNames[i] || weekNames[d.getDay()],
          shortDate: `${mm}-${dd}`,
          dateString,
          id: "day" + dateString.replace(/-/g, "")
        });
      }
      availableDays.value = days;
    };
    const generateStandardTimeSlots = () => {
      const slots = [];
      for (let i = 9; i <= 18; i++) {
        slots.push({ time: `${String(i).padStart(2, "0")}:00`, isBooked: false, isPast: false, isCancelled: false, appointment: null });
      }
      return slots;
    };
    const selectDate = async (dateString) => {
      selectedDate.value = dateString;
      await fetchAppointmentsForDate(dateString);
    };
    const fetchAppointmentsForDate = async (date) => {
      isLoading.value = true;
      timeSlots.value = [];
      try {
        const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
        const workerId = userInfo._id;
        if (!workerId)
          throw new Error("无法获取师傅ID，请重新登录");
        const res = await common_vendor.tr.callFunction({
          name: "getAppointmentsForWorker",
          data: { workerId, date }
        });
        if (res.result.success) {
          appointments.value = res.result.data;
          updateTimeSlots(date);
        } else {
          throw new Error(res.result.message || "加载预约失败");
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/worker-schedule/worker-schedule.vue:216", err);
        common_vendor.index.showToast({ title: err.message, icon: "none" });
        timeSlots.value = generateStandardTimeSlots();
      } finally {
        isLoading.value = false;
      }
    };
    const updateTimeSlots = (date) => {
      const now = /* @__PURE__ */ new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const currentHour = now.getHours();
      timeSlots.value = generateStandardTimeSlots().map((slot) => {
        const h = parseInt(slot.time.split(":")[0]);
        const isPast = date < todayStr || date === todayStr && h < currentHour;
        const appsForSlot = appointments.value.filter((a) => a.serviceHour === slot.time);
        let app = appsForSlot.find((a) => a.status === "confirmed");
        if (!app) {
          app = appsForSlot.find((a) => a.status === "completed");
        }
        if (!app) {
          app = appsForSlot[0];
        }
        const status = app ? app.status : "available";
        const isBooked = !!app;
        const isConfirmed = status === "confirmed";
        const isCompleted = status === "completed";
        const isCancelled = status === "cancelled_by_user" || status === "cancelled_by_worker";
        return {
          ...slot,
          isBooked,
          isPast,
          appointment: app,
          // 绑定具有最高优先级的预约记录
          isConfirmed,
          isCompleted,
          isCancelled
        };
      });
    };
    const selectTimeSlot = (slot) => {
      if (!slot.isBooked)
        return;
      selectedAppointment.value = slot.appointment;
    };
    const handleCancel = (appointment) => {
      common_vendor.index.showModal({
        title: "取消预约",
        editable: true,
        placeholderText: "请输入取消原因（必填）",
        success: async (res) => {
          if (res.confirm) {
            const reason = res.content;
            if (!reason.trim()) {
              common_vendor.index.showToast({ title: "必须填写取消原因", icon: "none" });
              return;
            }
            common_vendor.index.showLoading({ title: "正在提交..." });
            try {
              const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
              const workerPhone = userInfo.phoneNumber;
              const cancelRes = await common_vendor.tr.callFunction({
                name: "cancelAppointmentByWorker",
                data: {
                  appointmentId: appointment._id,
                  workerPhone,
                  cancellationReason: reason
                }
              });
              common_vendor.index.hideLoading();
              if (cancelRes.result.success) {
                common_vendor.index.showToast({ title: "取消成功", icon: "success" });
                closeModal();
                fetchAppointmentsForDate(selectedDate.value);
              } else {
                throw new Error(cancelRes.result.message || "取消失败");
              }
            } catch (error) {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: error.message, icon: "none" });
            }
          }
        }
      });
    };
    const closeModal = () => {
      selectedAppointment.value = null;
    };
    const makePhoneCall = (num) => common_vendor.index.makePhoneCall({ phoneNumber: num });
    const navigateToLocation = (serviceAddress) => {
      if (!serviceAddress || !serviceAddress.latitude || !serviceAddress.longitude) {
        common_vendor.index.showToast({
          title: "地址信息不完整",
          icon: "none"
        });
        return;
      }
      common_vendor.index.openLocation({
        latitude: serviceAddress.latitude,
        longitude: serviceAddress.longitude,
        name: serviceAddress.name,
        address: serviceAddress.address + serviceAddress.detail,
        fail: (err) => {
          common_vendor.index.showToast({
            title: "打开地图失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/worker-schedule/worker-schedule.vue:342", "uni.openLocation failed:", err);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(availableDays.value, (day, index, i0) => {
          return {
            a: common_vendor.t(day.name),
            b: common_vendor.t(day.shortDate),
            c: index,
            d: day.id,
            e: selectedDate.value === day.dateString ? 1 : "",
            f: common_vendor.o(($event) => selectDate(day.dateString), index)
          };
        }),
        b: scrollIntoViewId.value,
        c: isLoading.value
      }, isLoading.value ? {
        d: common_vendor.p({
          status: "loading"
        })
      } : timeSlots.value.length === 0 ? {
        f: common_assets._imports_0$3
      } : {
        g: common_vendor.f(timeSlots.value, (slot, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(slot.time),
            b: slot.isBooked
          }, slot.isBooked ? {
            c: common_vendor.t(slot.isCompleted ? "已完成" : slot.isCancelled ? "已取消" : "已预约"),
            d: slot.isCompleted ? 1 : "",
            e: slot.isCancelled ? 1 : ""
          } : {}, {
            f: index,
            g: slot.isConfirmed ? 1 : "",
            h: slot.isCompleted ? 1 : "",
            i: slot.isCancelled ? 1 : "",
            j: slot.isPast && !slot.isBooked ? 1 : "",
            k: common_vendor.o(($event) => selectTimeSlot(slot), index)
          });
        })
      }, {
        e: timeSlots.value.length === 0,
        h: selectedAppointment.value
      }, selectedAppointment.value ? common_vendor.e({
        i: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#666"
        }),
        j: common_vendor.t(selectedAppointment.value.serviceDate),
        k: common_vendor.t(selectedAppointment.value.serviceHour),
        l: common_vendor.p({
          type: "person",
          size: "20",
          color: "#666"
        }),
        m: common_vendor.t(selectedAppointment.value.userName),
        n: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#666"
        }),
        o: common_vendor.t(selectedAppointment.value.userPhone),
        p: common_vendor.o(($event) => makePhoneCall(selectedAppointment.value.userPhone)),
        q: selectedAppointment.value.serviceAddress
      }, selectedAppointment.value.serviceAddress ? {
        r: common_vendor.p({
          type: "location",
          size: "20",
          color: "#666"
        }),
        s: common_vendor.t(selectedAppointment.value.serviceAddress.address),
        t: common_vendor.t(selectedAppointment.value.serviceAddress.detail),
        v: common_vendor.o(($event) => navigateToLocation(selectedAppointment.value.serviceAddress))
      } : {}, {
        w: common_vendor.p({
          type: "chat",
          size: "20",
          color: "#666"
        }),
        x: common_vendor.t(selectedAppointment.value.remark),
        y: selectedAppointment.value.status === "confirmed"
      }, selectedAppointment.value.status === "confirmed" ? {
        z: common_vendor.o(($event) => handleCancel(selectedAppointment.value))
      } : {}, {
        A: common_vendor.o(() => {
        }),
        B: common_vendor.o(closeModal)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-516443f4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/worker-schedule/worker-schedule.js.map
