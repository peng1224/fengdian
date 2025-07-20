"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "user-schedule",
  setup(__props) {
    const appointments = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    const reviewModalVisible = common_vendor.ref(false);
    const selectedAppointment = common_vendor.ref(null);
    const reviewForm = common_vendor.reactive({
      rating: 5,
      // 默认5星好评
      comment: "",
      images: [],
      // 本地临时路径
      imageUrls: [],
      // 上传后的云存储路径
      anonymous: false
      // 新增匿名选项，默认不匿名
    });
    const CUSTOMER_SERVICE_CONTACTS = {
      phone: "19357501597",
      // 您的客服电话
      wechat: "Chen_100peng",
      // 您的客服微信号
      qq: "3327261595"
      // 您的客服QQ号
    };
    function translateStatus(status) {
      const map = {
        confirmed: "预约成功",
        cancelled_by_worker: "师傅已取消",
        cancelled_by_user: "用户已取消",
        completed: "已完成"
      };
      return map[status] || status;
    }
    async function fetchAppointments() {
      loading.value = true;
      const userinfo = common_vendor.index.getStorageSync("userinfo");
      if (!userinfo || !userinfo._id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        loading.value = false;
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getUserAppointments",
          data: { userId: userinfo._id }
        });
        if (res.result.success) {
          appointments.value = res.result.data;
          common_vendor.index.__f__("log", "at pages/user-schedule/user-schedule.vue:183", "获取到的预约数据:", appointments.value);
        } else {
          common_vendor.index.__f__("error", "at pages/user-schedule/user-schedule.vue:185", "云函数返回错误", res.result.message);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user-schedule/user-schedule.vue:188", "调用云函数失败", e);
      } finally {
        loading.value = false;
      }
    }
    const contactCustomerService = () => {
      common_vendor.index.showActionSheet({
        itemList: ["拨打电话", "复制微信号", "复制QQ号"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.makePhoneCall({
              phoneNumber: CUSTOMER_SERVICE_CONTACTS.phone
            });
          } else if (res.tapIndex === 1) {
            common_vendor.index.setClipboardData({
              data: CUSTOMER_SERVICE_CONTACTS.wechat,
              success: () => {
                common_vendor.index.showToast({
                  title: "微信号已复制",
                  icon: "success"
                });
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/user-schedule/user-schedule.vue:214", "复制微信号失败:", err);
                common_vendor.index.showToast({
                  title: "复制失败，请手动复制",
                  icon: "none"
                });
              }
            });
          } else if (res.tapIndex === 2) {
            common_vendor.index.setClipboardData({
              data: CUSTOMER_SERVICE_CONTACTS.qq,
              success: () => {
                common_vendor.index.showToast({
                  title: "QQ号已复制",
                  icon: "success"
                });
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/user-schedule/user-schedule.vue:232", "复制QQ号失败:", err);
                common_vendor.index.showToast({
                  title: "复制失败，请手动复制",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/user-schedule/user-schedule.vue:242", "用户取消选择", res.errMsg);
        }
      });
    };
    const getButtonGroupClass = (item) => {
      let buttonCount = 0;
      if (item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime > Date.now()) {
        buttonCount = 2;
      } else if (item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime <= Date.now()) {
        buttonCount = 2;
      } else if (item.status === "completed" && !item.review) {
        buttonCount = 2;
      } else if (item.status === "completed" && item.review) {
        buttonCount = 1;
      } else if (item.status.startsWith("cancelled") && item.refundInfo) {
        buttonCount = 1;
      }
      return {
        "justify-two-buttons": buttonCount === 2,
        "justify-one-button": buttonCount === 1
      };
    };
    const viewRefundDetail = (appointmentItem) => {
      let refundMessage = `总金额: ¥${(appointmentItem.total_fee / 100).toFixed(2)}
`;
      if (appointmentItem.refundInfo) {
        refundMessage += `用户退款: ¥${(appointmentItem.refundInfo.userRefundAmount / 100).toFixed(2)}
`;
        refundMessage += `师傅补偿: ¥${(appointmentItem.refundInfo.workerCompensation / 100).toFixed(2)}
`;
        refundMessage += `平台扣费: ¥${(appointmentItem.refundInfo.platformFee / 100).toFixed(2)}
`;
        if (appointmentItem.refundInfo.refundNo) {
          refundMessage += `退款单号: ${appointmentItem.refundInfo.refundNo}
`;
        }
        if (appointmentItem.refundInfo.refundAt) {
          const refundDate = new Date(appointmentItem.refundInfo.refundAt);
          refundMessage += `退款时间: ${refundDate.toLocaleString()}
`;
        }
      } else {
        refundMessage += "无详细退款信息。";
      }
      common_vendor.index.showModal({
        title: "退款详情",
        content: refundMessage,
        showCancel: false,
        confirmText: "确定"
      });
    };
    async function cancelAppointment(appointmentItem) {
      if (appointmentItem.status !== "confirmed" || !appointmentItem.expectedEndTime || appointmentItem.expectedEndTime <= Date.now()) {
        common_vendor.index.showToast({ title: "该预约无法取消", icon: "none" });
        return;
      }
      const res = await common_vendor.index.showModal({
        title: "确认取消预约？",
        editable: true,
        placeholderText: "请输入取消原因（必填）",
        confirmText: "确认取消",
        cancelText: "点错了"
      });
      if (res.confirm) {
        const reason = res.content;
        if (!reason || !reason.trim()) {
          common_vendor.index.showToast({ title: "必须填写取消原因", icon: "none" });
          return;
        }
        common_vendor.index.showLoading({ title: "正在取消..." });
        try {
          const userinfo = common_vendor.index.getStorageSync("userinfo");
          if (!userinfo || !userinfo._id) {
            throw new Error("无法获取用户信息，请重新登录");
          }
          const dataToSend = {
            appointmentId: appointmentItem._id,
            cancellationReason: reason,
            userId: userinfo._id
          };
          common_vendor.index.__f__("log", "at pages/user-schedule/user-schedule.vue:342", "即将发送给 cancelAppointmentByUser 云函数的参数:", dataToSend);
          const result = await common_vendor.tr.callFunction({
            name: "cancelAppointmentByUser",
            data: dataToSend
          });
          if (result.result.success) {
            common_vendor.index.showToast({ title: "取消成功", icon: "success" });
            fetchAppointments();
          } else {
            throw new Error(result.result.message || "取消失败");
          }
        } catch (error) {
          common_vendor.index.showToast({ title: error.message, icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
        }
      }
    }
    async function completeAppointment(appointmentItem) {
      const res = await common_vendor.index.showModal({
        title: "确认完成服务？",
        content: "完成后可选择评价"
      });
      if (!res.confirm)
        return;
      common_vendor.index.showLoading({ title: "请稍候..." });
      try {
        const res2 = await common_vendor.tr.callFunction({
          name: "updateAppointmentStatusByuser",
          data: {
            appointmentId: appointmentItem._id,
            status: "completed"
          }
        });
        if (res2.result.success) {
          common_vendor.index.showToast({ title: "服务已完成", icon: "success" });
          fetchAppointments();
        } else {
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function openReviewModal(appointmentItem) {
      selectedAppointment.value = appointmentItem;
      reviewForm.rating = 5;
      reviewForm.comment = "";
      reviewForm.images = [];
      reviewForm.imageUrls = [];
      reviewForm.anonymous = false;
      reviewModalVisible.value = true;
    }
    function closeReviewModal() {
      reviewModalVisible.value = false;
    }
    function setRating(star) {
      reviewForm.rating = star;
    }
    async function chooseImage() {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 3 - reviewForm.images.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        reviewForm.images.push(...res.tempFilePaths);
      } catch (e) {
      }
    }
    function removeImage(index) {
      reviewForm.images.splice(index, 1);
    }
    function toggleAnonymous(e) {
      reviewForm.anonymous = e.detail.value.length > 0;
    }
    async function submitReview() {
      common_vendor.index.showLoading({ title: "正在提交..." });
      const userinfo = common_vendor.index.getStorageSync("userinfo");
      let reviewerName = "";
      let reviewerAvatar = "/static/images/avatar-placeholder.png";
      if (!reviewForm.anonymous && userinfo) {
        if (userinfo.name)
          reviewerName = userinfo.name;
        if (userinfo.avatar)
          reviewerAvatar = userinfo.avatar;
      }
      try {
        for (const imagePath of reviewForm.images) {
          const uploadResult = await common_vendor.tr.uploadFile({
            filePath: imagePath,
            cloudPath: `review-images/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`,
            cloudPathAsRealPath: true
          });
          reviewForm.imageUrls.push(uploadResult.fileID);
        }
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "图片上传失败", icon: "none" });
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "submitReview",
          data: {
            appointmentId: selectedAppointment.value._id,
            workerPhone: selectedAppointment.value.workerPhone,
            reviewData: {
              rating: reviewForm.rating,
              comment: reviewForm.comment,
              images: reviewForm.imageUrls,
              name: reviewerName,
              avatar: reviewerAvatar
            }
          }
        });
        common_vendor.index.hideLoading();
        if (res.result.success) {
          common_vendor.index.showToast({ title: "评价成功", icon: "success" });
          closeReviewModal();
          fetchAppointments();
        } else {
          common_vendor.index.showToast({ title: res.result.message || "提交失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "提交失败，请重试", icon: "none" });
      }
    }
    common_vendor.onShow(fetchAppointments);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : appointments.value.length === 0 ? {} : {
        c: common_vendor.f(appointments.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.serviceDate),
            b: common_vendor.t(item.serviceHour),
            c: common_vendor.t(item.workerPhone),
            d: item.remark
          }, item.remark ? {
            e: common_vendor.t(item.remark)
          } : {}, {
            f: common_vendor.t(translateStatus(item.status)),
            g: common_vendor.n(`status-${item.status}`),
            h: item.review && item.review.comment
          }, item.review && item.review.comment ? {
            i: common_vendor.t(item.review.comment)
          } : {}, {
            j: item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime > Date.now()
          }, item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime > Date.now() ? {
            k: common_vendor.o(($event) => cancelAppointment(item), item._id),
            l: common_vendor.o(($event) => completeAppointment(item), item._id)
          } : item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime <= Date.now() ? {
            n: common_vendor.o(contactCustomerService, item._id),
            o: common_vendor.o(($event) => completeAppointment(item), item._id)
          } : item.status === "completed" && !item.review ? {
            q: common_vendor.o(contactCustomerService, item._id),
            r: common_vendor.o(($event) => openReviewModal(item), item._id)
          } : item.status === "completed" && item.review ? {
            t: common_vendor.o(contactCustomerService, item._id)
          } : item.status.startsWith("cancelled") && item.refundInfo ? {
            w: common_vendor.o(($event) => viewRefundDetail(item), item._id)
          } : {}, {
            m: item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime <= Date.now(),
            p: item.status === "completed" && !item.review,
            s: item.status === "completed" && item.review,
            v: item.status.startsWith("cancelled") && item.refundInfo,
            x: common_vendor.n(getButtonGroupClass(item)),
            y: item._id
          });
        })
      }, {
        b: appointments.value.length === 0,
        d: reviewModalVisible.value
      }, reviewModalVisible.value ? common_vendor.e({
        e: common_vendor.o(closeReviewModal),
        f: common_vendor.f(5, (star, k0, i0) => {
          return {
            a: star,
            b: star <= reviewForm.rating ? 1 : "",
            c: common_vendor.o(($event) => setRating(star), star)
          };
        }),
        g: reviewForm.comment,
        h: common_vendor.o(($event) => reviewForm.comment = $event.detail.value),
        i: common_vendor.f(reviewForm.images, (image, index, i0) => {
          return {
            a: image,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        j: reviewForm.images.length < 3
      }, reviewForm.images.length < 3 ? {
        k: common_vendor.o(chooseImage)
      } : {}, {
        l: reviewForm.anonymous,
        m: common_vendor.o(toggleAnonymous),
        n: common_vendor.o(submitReview),
        o: common_vendor.o(() => {
        }),
        p: common_vendor.o(closeReviewModal)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3ba41579"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user-schedule/user-schedule.js.map
