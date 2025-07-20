"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_skeleton = common_vendor.resolveComponent("uni-skeleton");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_uni_skeleton + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "newsDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    function formatNum(n) {
      return n > 1e4 ? (n / 1e4).toFixed(1) + "万" : n;
    }
    function formatTime(d) {
      if (!d)
        return "";
      const dt = new Date(d);
      return `${dt.getMonth() + 1}-${dt.getDate()}`;
    }
    common_vendor.onLoad((options) => {
      const id = options.id;
      getDetail(id);
    });
    async function getDetail(id) {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        const res = await common_vendor.tr.callFunction({
          name: "getNewsDetail",
          data: { id }
        });
        if (res.result && res.result.data) {
          const data = res.result.data;
          data.publish_date = formatTime(data.publish_date);
          data.view_count = formatNum(data.view_count);
          data.content = data.content.replace(/<p/gi, "<p class='pstyle'");
          data.content = data.content.replace(/<img/gi, "<img class='imgstyle'");
          detail.value = data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/newsDetail/newsDetail.vue:75", "获取新闻详情失败", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !detail.value
      }, !detail.value ? {
        b: common_vendor.p({
          title: true,
          row: 5
        })
      } : {
        c: common_vendor.t(detail.value.title),
        d: common_vendor.t(detail.value.publish_date),
        e: common_vendor.t(detail.value.author),
        f: common_vendor.t(detail.value.view_count),
        g: common_vendor.p({
          type: "paperplane",
          size: "18"
        }),
        h: detail.value.content
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca9fe72"]]);
tt.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/newsDetail/newsDetail.js.map
