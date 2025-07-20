"use strict";
const common_vendor = require("../../common/vendor.js");
const pageSize = 10;
const _sfc_main = {
  __name: "allComments",
  setup(__props) {
    const technicianId = common_vendor.ref("");
    const technicianInfo = common_vendor.ref(null);
    const comments = common_vendor.ref([]);
    const replyState = common_vendor.reactive({});
    const loading = common_vendor.ref(true);
    const isLoadMore = common_vendor.ref(false);
    const hasMoreData = common_vendor.ref(true);
    const page = common_vendor.ref(1);
    common_vendor.onLoad((options) => {
      if (options.technicianId) {
        technicianId.value = options.technicianId;
        fetchComments();
      } else {
        common_vendor.index.showToast({ title: "参数错误", icon: "none" });
        loading.value = false;
      }
    });
    common_vendor.onReachBottom(() => {
      if (hasMoreData.value && !isLoadMore.value) {
        page.value++;
        fetchComments(true);
      }
    });
    const fetchComments = async (isLoadMoreAction = false) => {
      if (isLoadMoreAction) {
        isLoadMore.value = true;
      } else {
        loading.value = true;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getCommentsByTechnicianId",
          data: {
            technicianId: technicianId.value,
            page: page.value,
            pageSize
          }
        });
        if (res.result.success) {
          const { commentData, total, techInfo } = res.result;
          if (!technicianInfo.value) {
            technicianInfo.value = techInfo;
          }
          commentData.forEach((comment) => {
            if (!replyState[comment.appointmentId]) {
              replyState[comment.appointmentId] = {
                showReplies: false,
                showInput: false,
                content: ""
              };
            }
          });
          comments.value = isLoadMoreAction ? [...comments.value, ...commentData] : commentData;
          hasMoreData.value = comments.value.length < total;
        } else {
          common_vendor.index.showToast({ title: res.result.message || "加载失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/allComments/allComments.vue:141", "获取评论失败", err);
        common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
      } finally {
        loading.value = false;
        isLoadMore.value = false;
      }
    };
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
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
        common_vendor.index.__f__("error", "at pages/allComments/allComments.vue:228", "回复提交失败", err);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: technicianInfo.value
      }, technicianInfo.value ? {
        b: technicianInfo.value.avatar,
        c: common_vendor.t(technicianInfo.value.name)
      } : {}, {
        d: loading.value
      }, loading.value ? {} : {}, {
        e: !loading.value && comments.value.length === 0
      }, !loading.value && comments.value.length === 0 ? {} : {}, {
        f: common_vendor.f(comments.value, (item, k0, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.name),
            c: common_vendor.t(formatDate(item.createdAt)),
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
            i: common_vendor.o(($event) => toggleReplyInput(item.appointmentId)),
            j: item.replies && item.replies.length > 0
          }, item.replies && item.replies.length > 0 ? {
            k: common_vendor.f(item.replies, (reply, k1, i1) => {
              return {
                a: reply.userAvatar,
                b: common_vendor.t(reply.userName),
                c: common_vendor.t(formatDate(reply.createdAt)),
                d: common_vendor.t(reply.content),
                e: reply.replyId
              };
            }),
            l: (_a = replyState[item.appointmentId]) == null ? void 0 : _a.showReplies,
            m: common_vendor.t(((_b = replyState[item.appointmentId]) == null ? void 0 : _b.showReplies) ? "收起回复" : `查看全部 ${item.replies.length} 条回复`),
            n: common_vendor.o(($event) => toggleReplies(item.appointmentId))
          } : {}, {
            o: (_c = replyState[item.appointmentId]) == null ? void 0 : _c.showInput
          }, ((_d = replyState[item.appointmentId]) == null ? void 0 : _d.showInput) ? {
            p: replyState[item.appointmentId].content,
            q: common_vendor.o(($event) => replyState[item.appointmentId].content = $event.detail.value),
            r: common_vendor.o(($event) => handleReplySubmit(item.appointmentId))
          } : {}, {
            s: item.appointmentId
          });
        }),
        g: isLoadMore.value
      }, isLoadMore.value ? {} : {}, {
        h: !hasMoreData.value && comments.value.length > 0
      }, !hasMoreData.value && comments.value.length > 0 ? {} : {});
    };
  }
};
tt.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/allComments/allComments.js.map
