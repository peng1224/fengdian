"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "news-item",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: __props.item.picurl,
        b: common_vendor.t(__props.item.title),
        c: common_vendor.p({
          type: "calendar",
          size: "18"
        }),
        d: common_vendor.t(__props.item.publish_date),
        e: common_vendor.p({
          type: "eye",
          size: "18"
        }),
        f: common_vendor.t(__props.item.view_count_display),
        g: common_vendor.p({
          type: "person",
          size: "18"
        }),
        h: common_vendor.t(__props.item.author),
        i: "/pages/NewsDetail/NewsDetail?id=" + __props.item._id
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3492b3e8"]]);
tt.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-toutiao/pages/news-item.js.map
