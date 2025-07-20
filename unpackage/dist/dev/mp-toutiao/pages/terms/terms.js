"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "terms",
  setup(__props) {
    function goBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack)
      };
    };
  }
};
tt.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-toutiao/pages/terms/terms.js.map
