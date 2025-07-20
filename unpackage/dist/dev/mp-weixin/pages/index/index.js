"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  NewsItem();
}
const NewsItem = () => "../news-item.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const navArr = common_vendor.ref([]);
    const latitude = common_vendor.ref(0);
    const longitude = common_vendor.ref(0);
    const newsArr = common_vendor.ref([]);
    function handleNavClick(categoryId) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:85", "[index] 点击分类，缓存 categoryId=", categoryId);
      common_vendor.index.setStorageSync("initialCategoryId", categoryId);
      common_vendor.index.switchTab({
        url: "/pages/previewList/previewList"
      });
    }
    function handleImageError(e) {
      common_vendor.index.__f__("error", "at pages/index/index.vue:93", "图片加载失败", e);
    }
    function getUserLocation() {
      common_vendor.index.showLoading({ title: "定位中..." });
      common_vendor.index.getLocation({
        type: "gcj02",
        success(res) {
          common_vendor.index.hideLoading();
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          common_vendor.index.setStorageSync("userLocation", {
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail() {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "获取位置失败", icon: "none" });
        }
      });
    }
    async function getNavData() {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        const res = await common_vendor.tr.callFunction({ name: "getNavData" });
        common_vendor.index.hideLoading();
        if (res.result.code === 0) {
          navArr.value = res.result.data.filter((i) => i.icon && i.classname);
        }
      } catch {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "导航加载失败", icon: "none" });
      }
    }
    async function getNewsData() {
      try {
        const res = await common_vendor.tr.callFunction({ name: "getNewsData" });
        if (res.result.data) {
          newsArr.value = res.result.data.map((item) => ({
            ...item,
            view_count_display: formatNum(item.view_count),
            publish_date: formatTime(item.publish_date)
          }));
        }
      } catch {
        common_vendor.index.showToast({ title: "新闻加载失败", icon: "none" });
      }
    }
    function formatNum(n) {
      return n > 1e4 ? (n / 1e4).toFixed(1) + "万" : n;
    }
    function formatTime(d) {
      const dt = new Date(d);
      return `${dt.getMonth() + 1}-${dt.getDate()}`;
    }
    async function onNewsClick(id, idx) {
      common_vendor.index.vibrateShort && common_vendor.index.vibrateShort();
      await common_vendor.tr.callFunction({ name: "upNewsview_count", data: { id } });
      newsArr.value[idx].view_count++;
      newsArr.value[idx].view_count_display = formatNum(newsArr.value[idx].view_count);
      common_vendor.index.navigateTo({
        url: `/pages/newsDetail/newsDetail?id=${id}`
      });
    }
    common_vendor.onMounted(() => {
      getNavData();
      getUserLocation();
      getNewsData();
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: "蜂点到家 - 本地靠谱的家政技工平台",
        path: "/pages/index/index"
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "蜂点到家 - 快速预约本地服务"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: latitude.value,
        b: longitude.value,
        c: common_assets._imports_0,
        d: common_vendor.o(getUserLocation),
        e: navArr.value.length === 0
      }, navArr.value.length === 0 ? {} : {}, {
        f: common_vendor.f(navArr.value, (item, index, i0) => {
          return {
            a: item.icon || "/static/images/default-icon.png",
            b: common_vendor.o(handleImageError, item._id),
            c: common_vendor.t(item.classname),
            d: item._id,
            e: common_vendor.o(($event) => handleNavClick(item._id), item._id)
          };
        }),
        g: common_vendor.f(newsArr.value, (item, index, i0) => {
          return {
            a: "f4ccd9f2-0-" + i0,
            b: common_vendor.p({
              item
            }),
            c: item._id,
            d: common_vendor.o(($event) => onNewsClick(item._id, index), item._id)
          };
        })
      });
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
