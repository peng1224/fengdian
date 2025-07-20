"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "previewList",
  setup(__props) {
    const categories = common_vendor.ref([]);
    const navArr = common_vendor.ref([]);
    const serviceList = common_vendor.ref([]);
    const filteredList = common_vendor.ref([]);
    const isLoaded = common_vendor.ref(false);
    const hasError = common_vendor.ref(false);
    const scrollLeft = common_vendor.ref(0);
    const currentCategory = common_vendor.ref("all");
    const animateActive = common_vendor.ref(false);
    const isFading = common_vendor.ref(false);
    const initialCategoryId = common_vendor.ref(null);
    let lastKnownScrollLeft = 0;
    let scrollTimer = null;
    common_vendor.watch(categories, (newVal) => {
      if (newVal.length > 0 && initialCategoryId.value) {
        applyInitialCategory();
      }
    });
    common_vendor.onShow(() => {
      const initId = common_vendor.index.getStorageSync("initialCategoryId");
      if (initId) {
        common_vendor.index.removeStorageSync("initialCategoryId");
        initialCategoryId.value = initId;
        if (categories.value.length > 0) {
          applyInitialCategory();
        }
      }
    });
    common_vendor.onMounted(async () => {
      await initialLoadData();
    });
    async function initialLoadData() {
      isLoaded.value = false;
      hasError.value = false;
      common_vendor.index.showLoading({ title: "加载中...", mask: true });
      try {
        await loadNav();
        await loadServices();
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/previewList/previewList.vue:158", "Initial data load failed:", e);
        hasError.value = true;
        common_vendor.index.showToast({ title: "数据加载失败，请重试", icon: "none" });
      } finally {
        isLoaded.value = true;
        common_vendor.index.hideLoading();
      }
    }
    function retryLoad() {
      initialLoadData();
    }
    async function loadNav() {
      try {
        const { result } = await common_vendor.tr.callFunction({ name: "getNavData" });
        const navData = result.data || [];
        navArr.value = navData;
        categories.value = [{ type: "all", name: "全部" }].concat(
          navData.map((i) => ({ type: i._id, name: i.classname }))
        );
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/previewList/previewList.vue:182", "加载分类数据失败:", e);
        throw new Error("加载分类失败");
      }
    }
    async function loadServices() {
      try {
        const { result } = await common_vendor.tr.callFunction({
          name: "getRecommendedHomepages",
          data: { userLocation: common_vendor.index.getStorageSync("userLocation") || {} }
        });
        const data = result.data || [];
        const userLocation = common_vendor.index.getStorageSync("userLocation") || {};
        const formatted = data.map((i) => {
          let distance = "";
          if (userLocation.latitude != null && userLocation.longitude != null && i.latitude != null && i.longitude != null) {
            const d = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              i.latitude,
              i.longitude
            );
            distance = `${d.toFixed(1)}公里`;
          }
          const categoriesDisplay = (i.categories || []).map((id) => {
            const cat = navArr.value.find((c) => c._id === id);
            return cat ? cat.classname : "";
          }).filter(Boolean).join(", ") || "暂无分类";
          return {
            id: i._id,
            title: (i.name || "未命名").slice(0, 5),
            serviceArea: i.serviceArea,
            avatar: i.avatar || "",
            description: i.description || "",
            skills: i.skills || [],
            categories: i.categories || [],
            distance,
            categoriesDisplay
          };
        });
        serviceList.value = formatted;
        filteredList.value = formatted;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/previewList/previewList.vue:237", "加载服务列表数据失败:", e);
        throw new Error("加载服务列表失败");
      }
    }
    function applyInitialCategory() {
      const initId = initialCategoryId.value;
      if (!initId)
        return;
      const idx = categories.value.findIndex((c) => c.type === initId);
      if (idx !== -1) {
        switchCategory(initId, idx);
      }
      initialCategoryId.value = null;
    }
    function switchCategory(type, idx) {
      if (currentCategory.value === type)
        return;
      isFading.value = true;
      setTimeout(() => {
        currentCategory.value = type;
        animateActive.value = true;
        filteredList.value = type === "all" ? serviceList.value : serviceList.value.filter((i) => i.categories.includes(type));
        common_vendor.nextTick$1(() => scrollToCategory(idx));
        setTimeout(() => {
          isFading.value = false;
          animateActive.value = false;
        }, 300);
      }, 10);
    }
    function scrollToCategory(idx) {
      common_vendor.index.createSelectorQuery().select(`#nav_${idx}`).boundingClientRect().select(".nav-scroll").boundingClientRect().exec(([itemRect, scrollRect]) => {
        if (!itemRect || !scrollRect)
          return;
        const offset = lastKnownScrollLeft + (itemRect.left + itemRect.width / 2) - scrollRect.width / 2;
        scrollLeft.value = offset;
        lastKnownScrollLeft = offset;
      });
    }
    function onScroll(e) {
      if (scrollTimer)
        clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        lastKnownScrollLeft = e.detail.scrollLeft;
      }, 100);
    }
    function navigateDetail(id) {
      if (!id)
        return;
      common_vendor.index.navigateTo({ url: `/pages/HomepageDetail/HomepageDetail?id=${id}` });
    }
    function calculateDistance(lat1, lng1, lat2, lng2) {
      const rad = (d) => d * Math.PI / 180;
      const R = 6371;
      const dLat = rad(lat2 - lat1);
      const dLng = rad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
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
        a: common_vendor.f(categories.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.type,
            c: `nav_${index}`,
            d: currentCategory.value === item.type ? 1 : "",
            e: currentCategory.value === item.type && animateActive.value ? 1 : "",
            f: common_vendor.o(($event) => switchCategory(item.type, index), item.type)
          };
        }),
        b: scrollLeft.value,
        c: common_vendor.o(onScroll),
        d: !isLoaded.value && !hasError.value
      }, !isLoaded.value && !hasError.value ? {
        e: common_vendor.f(3, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : hasError.value ? {
        g: common_vendor.o(retryLoad)
      } : common_vendor.e({
        h: filteredList.value.length > 0
      }, filteredList.value.length > 0 ? {
        i: common_vendor.f(filteredList.value, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.serviceArea || "未知"),
            b: common_vendor.t(item.distance),
            c: !item.distance ? 1 : "",
            d: item.avatar || "/static/images/default-avatar.jpg",
            e: common_vendor.t(item.title),
            f: common_vendor.t(item.categoriesDisplay || "暂无分类"),
            g: common_vendor.t(item.description || ""),
            h: common_vendor.f(item.skills, (skill, skillIndex, i1) => {
              return {
                a: common_vendor.t(skill),
                b: skillIndex
              };
            }),
            i: item.id,
            j: common_vendor.o(($event) => navigateDetail(item.id), item.id)
          };
        })
      } : {}), {
        f: hasError.value,
        j: isFading.value ? 1 : ""
      });
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/previewList/previewList.js.map
