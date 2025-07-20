"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "HomepageDetail",
  setup(__props) {
    common_vendor.tr.database();
    const detail = common_vendor.ref(null);
    const id = common_vendor.ref("");
    const loading = common_vendor.ref(true);
    const maskedPhone = common_vendor.ref("");
    const replyState = common_vendor.reactive({});
    const visibleComments = common_vendor.computed(() => {
      if (!detail.value || !detail.value.comments) {
        return [];
      }
      return detail.value.comments.slice(0, 2);
    });
    const formatMonthDay = (timestamp) => {
      const date = new Date(timestamp);
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${m.toString().padStart(2, "0")}月${d.toString().padStart(2, "0")}日`;
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        id.value = options.id;
        getDetail();
        recordView(options.id);
      } else {
        common_vendor.index.showToast({
          title: "无法加载详情",
          icon: "none"
        });
        loading.value = false;
      }
    });
    const getDetail = async () => {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getHomepageDetail",
          data: { id: id.value }
        });
        if (res.result && res.result.data) {
          let workerDetail = res.result.data;
          const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
          const currentUserPhone = userInfo.phoneNumber;
          let hasLikedToday = false;
          if (workerDetail.likedBy && Array.isArray(workerDetail.likedBy) && currentUserPhone) {
            const today = (/* @__PURE__ */ new Date()).toDateString();
            hasLikedToday = workerDetail.likedBy.some(
              (item) => item.phoneNumber === currentUserPhone && new Date(item.likeTime).toDateString() === today
            );
          }
          workerDetail.userLiked = hasLikedToday;
          if (!workerDetail.bannerImages || !Array.isArray(workerDetail.bannerImages) || workerDetail.bannerImages.length === 0) {
            workerDetail.bannerImages = ["/static/images/logo.jpg"];
          }
          if (workerDetail.comments && Array.isArray(workerDetail.comments)) {
            workerDetail.comments.sort((a, b) => b.createdAt - a.createdAt);
          }
          if (workerDetail.comments) {
            workerDetail.comments.forEach((comment) => {
              replyState[comment.appointmentId] = {
                showReplies: false,
                // 默认不显示回复
                showInput: false,
                // 默认不显示输入框
                content: ""
                // 回复内容
              };
            });
          }
          const rawPhone = workerDetail.phoneNumber || "";
          maskedPhone.value = rawPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
          detail.value = workerDetail;
        } else {
          common_vendor.index.showToast({ title: "加载失败，无数据返回", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/HomepageDetail/HomepageDetail.vue:233", "加载详情失败", err);
        common_vendor.index.showToast({ title: "加载失败，请稍后重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const toggleLike = async () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!userInfo || !userInfo.phoneNumber) {
        return common_vendor.index.showToast({ title: "请先登录", icon: "none" });
      }
      const originalLiked = detail.value.userLiked;
      const originalCount = detail.value.likeCount;
      detail.value.userLiked = !originalLiked;
      detail.value.likeCount += originalLiked ? -1 : 1;
      common_vendor.index.vibrateShort();
      try {
        const res = await common_vendor.tr.callFunction({
          name: "updateLike",
          data: {
            id: id.value,
            phoneNumber: userInfo.phoneNumber
          }
        });
        if (!res.result.success) {
          detail.value.userLiked = originalLiked;
          detail.value.likeCount = originalCount;
          common_vendor.index.showToast({ title: res.result.message || "操作失败", icon: "none" });
        }
      } catch (err) {
        detail.value.userLiked = originalLiked;
        detail.value.likeCount = originalCount;
        common_vendor.index.showToast({ title: "点赞失败，请检查网络", icon: "none" });
      }
    };
    const recordView = (workerId) => {
      const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
      common_vendor.tr.callFunction({
        name: "recordHomepageView",
        data: {
          id: workerId,
          phoneNumber: userInfo.phoneNumber || "匿名用户"
        }
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/HomepageDetail/HomepageDetail.vue:286", "浏览记录成功", res);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/HomepageDetail/HomepageDetail.vue:288", "记录浏览失败", err);
      });
    };
    const handlePhoneCall = () => {
      var _a;
      const realPhone = (_a = detail.value) == null ? void 0 : _a.phoneNumber;
      if (!realPhone) {
        return common_vendor.index.showToast({ title: "电话号码未提供", icon: "none" });
      }
      common_vendor.index.showModal({
        title: "确认拨打",
        content: `确定拨打 ${maskedPhone.value} 吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: realPhone,
              success: () => {
                recordCallEvent();
              },
              fail: (err) => {
                common_vendor.index.__f__("log", "at pages/HomepageDetail/HomepageDetail.vue:309", "拨打失败", err);
              }
            });
          }
        }
      });
    };
    const recordCallEvent = () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
      common_vendor.tr.callFunction({
        name: "recordUserPhoneCallAction",
        data: {
          actionType: "phone_call",
          targetId: id.value,
          targetPhoneNumber: detail.value.phoneNumber,
          callerPhoneNumber: userInfo.phoneNumber || "未登录用户"
        }
      }).then(() => {
        common_vendor.index.__f__("log", "at pages/HomepageDetail/HomepageDetail.vue:328", "拨打事件已记录");
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/HomepageDetail/HomepageDetail.vue:330", "记录拨打行为失败", err);
      });
    };
    const handleStartChat = async () => {
      const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
      const userA_phone = userInfo.phoneNumber;
      const userB_phone = detail.value.phoneNumber;
      if (!userA_phone) {
        return common_vendor.index.showToast({ title: "请先登录", icon: "none" });
      }
      if (!userB_phone) {
        return common_vendor.index.showToast({ title: "无效的聊天对象", icon: "none" });
      }
      if (userA_phone === userB_phone) {
        return common_vendor.index.showToast({ title: "不能和自己聊天", icon: "none" });
      }
      common_vendor.index.showLoading({ title: "正在创建会话..." });
      try {
        const res = await common_vendor.tr.callFunction({
          name: "createOrUpdateChatSession",
          data: {
            userAPhone: userA_phone,
            userBPhone: userB_phone
          }
        });
        common_vendor.index.hideLoading();
        if (res.result.success && res.result.sessionId) {
          common_vendor.index.navigateTo({
            url: `/pages/chatDetail/chatDetail?sessionId=${res.result.sessionId}`
          });
        } else {
          common_vendor.index.showToast({ title: res.result.message || "会话创建失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/HomepageDetail/HomepageDetail.vue:370", "ChatSession 创建失败", err);
        common_vendor.index.showToast({ title: "会话创建出错，请重试", icon: "none" });
      }
    };
    const handleAppointment = () => {
      var _a, _b;
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!userInfo || !userInfo._id) {
        common_vendor.index.showToast({
          title: "请先登录再预约",
          icon: "none"
        });
        return;
      }
      const userId = ((_a = detail.value) == null ? void 0 : _a.userId) || "";
      const accountPhoneNumber = ((_b = detail.value) == null ? void 0 : _b.accountPhoneNumber) || "";
      if (!userId || !accountPhoneNumber) {
        return common_vendor.index.showToast({
          title: "预约信息不完整",
          icon: "none"
        });
      }
      common_vendor.index.navigateTo({
        url: `/pages/appointmentForm/appointmentForm?userId=${userId}&accountPhoneNumber=${accountPhoneNumber}`
      });
    };
    const toggleReplies = (commentId) => {
      if (replyState[commentId]) {
        replyState[commentId].showReplies = !replyState[commentId].showReplies;
      }
    };
    const toggleReplyInput = (commentId) => {
      const userInfo = common_vendor.index.getStorageSync("userinfo");
      if (!userInfo || !userInfo._id) {
        common_vendor.index.showToast({ title: "请先登录再回复", icon: "none" });
        return;
      }
      if (replyState[commentId]) {
        replyState[commentId].showInput = !replyState[commentId].showInput;
      }
    };
    const handleReplySubmit = async (commentId) => {
      const replyContent = replyState[commentId].content;
      if (!replyContent.trim()) {
        common_vendor.index.showToast({ title: "回复内容不能为空", icon: "none" });
        return;
      }
      const storageUser = common_vendor.index.getStorageSync("userinfo");
      if (!storageUser || !storageUser._id) {
        common_vendor.index.showToast({ title: "请先登录再回复", icon: "none" });
        return;
      }
      const caller = {
        _id: storageUser._id,
        nickname: storageUser.name || storageUser.nickname || "",
        // 优先用 name 或 nickname
        avatar: storageUser.avatar || ""
        // 本地存的 avatar 字段
      };
      common_vendor.index.showLoading({ title: "正在提交..." });
      try {
        const res = await common_vendor.tr.callFunction({
          name: "addCommentReply",
          data: {
            homepageId: detail.value._id,
            // 或 technicianId.value
            commentId,
            content: replyContent.trim(),
            userInfo: caller
            // 透传 caller 对象
          }
        });
        common_vendor.index.hideLoading();
        if (res.result.success) {
          common_vendor.index.showToast({ title: "回复成功", icon: "success" });
          replyState[commentId].content = "";
          replyState[commentId].showInput = false;
          getDetail();
        } else {
          common_vendor.index.showToast({ title: res.result.message || "回复失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "回复失败，请重试", icon: "none" });
        common_vendor.index.__f__("error", "at pages/HomepageDetail/HomepageDetail.vue:470", "回复提交失败", err);
      }
    };
    const navigateToAllComments = () => {
      common_vendor.index.navigateTo({
        url: `/pages/allComments/allComments?technicianId=${detail.value._id}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {
        b: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : {}, {
        c: !loading.value && detail.value
      }, !loading.value && detail.value ? common_vendor.e({
        d: common_vendor.f(detail.value.bannerImages, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        e: detail.value.avatar,
        f: common_vendor.t(detail.value.name),
        g: detail.value.age
      }, detail.value.age ? {
        h: common_vendor.t(detail.value.age)
      } : {}, {
        i: common_vendor.t(detail.value.serviceArea),
        j: `/static/images/${detail.value.userLiked ? "like.png" : "like.no.png"}`,
        k: common_vendor.t(detail.value.likeCount),
        l: common_vendor.o(toggleLike),
        m: common_vendor.f(detail.value.skills, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        n: common_vendor.t(detail.value.price),
        o: common_vendor.t(detail.value.description),
        p: detail.value.comments && detail.value.comments.length > 0
      }, detail.value.comments && detail.value.comments.length > 0 ? {
        q: common_vendor.f(visibleComments.value, (item, k0, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.name),
            c: common_vendor.t(formatMonthDay(item.createdAt)),
            d: item.rating
          }, item.rating ? {
            e: common_vendor.f(5, (star, k1, i1) => {
              return {
                a: star,
                b: star <= item.rating ? 1 : ""
              };
            })
          } : {}, {
            f: common_vendor.t(item.comment),
            g: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? {
            h: common_vendor.f(item.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img
              };
            })
          } : {}, {
            i: common_vendor.o(($event) => toggleReplyInput(item.appointmentId), item.appointmentId),
            j: item.replies && item.replies.length > 0
          }, item.replies && item.replies.length > 0 ? {
            k: common_vendor.f(item.replies, (reply, k1, i1) => {
              return {
                a: reply.userAvatar,
                b: common_vendor.t(reply.userName),
                c: common_vendor.t(formatMonthDay(reply.createdAt)),
                d: common_vendor.t(reply.content),
                e: reply.replyId
              };
            }),
            l: (_a = replyState[item.appointmentId]) == null ? void 0 : _a.showReplies,
            m: common_vendor.t(((_b = replyState[item.appointmentId]) == null ? void 0 : _b.showReplies) ? "收起回复" : `查看全部 ${item.replies.length} 条回复`),
            n: common_vendor.o(($event) => toggleReplies(item.appointmentId), item.appointmentId)
          } : {}, {
            o: (_c = replyState[item.appointmentId]) == null ? void 0 : _c.showInput
          }, ((_d = replyState[item.appointmentId]) == null ? void 0 : _d.showInput) ? {
            p: replyState[item.appointmentId].content,
            q: common_vendor.o(($event) => replyState[item.appointmentId].content = $event.detail.value, item.appointmentId),
            r: common_vendor.o(($event) => handleReplySubmit(item.appointmentId), item.appointmentId)
          } : {}, {
            s: item.appointmentId
          });
        }),
        r: common_vendor.t(detail.value.comments.length),
        s: common_vendor.o(navigateToAllComments)
      } : {}, {
        t: common_vendor.o(handlePhoneCall),
        v: common_vendor.o(handleStartChat),
        w: common_vendor.o(handleAppointment),
        x: detail.value.media && detail.value.media.length > 0
      }, detail.value.media && detail.value.media.length > 0 ? {
        y: common_vendor.f(detail.value.media, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "image"
          }, item.type === "image" ? {
            b: item.src
          } : {}, {
            c: item.type === "video"
          }, item.type === "video" ? {
            d: item.src
          } : {}, {
            e: index
          });
        })
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/HomepageDetail/HomepageDetail.js.map
