"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Homepage",
  setup(__props) {
    let qqmapsdk = null;
    const QQMapWX = require("../../static/js/qqmap-wx-jssdk.js");
    qqmapsdk = new QQMapWX({
      key: "ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46"
    });
    const userInfo = common_vendor.index.getStorageSync("userinfo") || {};
    function validateUserInfo(info) {
      return info.phoneNumber && info.name && info.avatar;
    }
    if (!validateUserInfo(userInfo)) {
      common_vendor.index.showToast({ title: "用户信息不完整", icon: "none" });
    }
    const providerShowcase = common_vendor.reactive({
      age: "",
      serviceArea: "",
      latitude: null,
      longitude: null,
      maxServiceDistance: 10,
      skills: [],
      price: "",
      description: "",
      categories: [],
      phoneNumber: userInfo.phoneNumber || "",
      // 数据库中存储的 bannerImages 和 media 的 cloud:// ID
      bannerCloudIDs: [],
      // 新增：存储轮播图的 cloud:// ID
      mediaCloudItems: []
      // 新增：存储媒体的 cloud:// ID 和类型，格式为 [{ src: 'cloud://', type: 'image' }]
    });
    const bannerImages = common_vendor.ref([]);
    const media = common_vendor.ref([]);
    const navArr = common_vendor.ref([]);
    const categories = common_vendor.ref([]);
    const selectedCategories = common_vendor.ref([]);
    const showTagInput = common_vendor.ref(false);
    const newTagText = common_vendor.ref("");
    const showAgeInput = common_vendor.ref(false);
    const tempAge = common_vendor.ref("");
    async function loadHomepageData(phoneNumber) {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "getHomepage",
          data: { phoneNumber }
        });
        if (res.result.success) {
          await updatePageData(res.result.data || {});
        } else {
          common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:241", "加载失败:", err);
        common_vendor.index.showToast({ title: "加载出错", icon: "none" });
      }
    }
    async function updatePageData(cloudData) {
      Object.assign(providerShowcase, {
        age: cloudData.age || "",
        serviceArea: cloudData.serviceArea || "",
        latitude: cloudData.latitude || null,
        longitude: cloudData.longitude || null,
        maxServiceDistance: cloudData.maxServiceDistance || 10,
        skills: cloudData.skills || [],
        price: cloudData.price || "",
        description: cloudData.description || "",
        categories: cloudData.categories || [],
        phoneNumber: cloudData.phoneNumber || providerShowcase.phoneNumber,
        // 从数据库加载原始 cloud:// ID 到 providerShowcase
        bannerCloudIDs: cloudData.bannerImages || [],
        mediaCloudItems: cloudData.media || []
      });
      if (providerShowcase.bannerCloudIDs.length > 0) {
        try {
          const tempFileURLsResult = await common_vendor.tr.getTempFileURL({
            fileList: providerShowcase.bannerCloudIDs
          });
          bannerImages.value = tempFileURLsResult.fileList.map((file) => ({
            url: file.tempFileURL,
            fileID: file.fileID
            // 保存 cloud ID 以便后续操作，如删除
          }));
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:275", "获取轮播图临时链接失败:", err);
          bannerImages.value = [];
        }
      } else {
        bannerImages.value = [];
      }
      if (providerShowcase.mediaCloudItems.length > 0) {
        const mediaFileIDs = providerShowcase.mediaCloudItems.map((item) => item.src);
        try {
          const tempMediaURLsResult = await common_vendor.tr.getTempFileURL({
            fileList: mediaFileIDs
          });
          media.value = tempMediaURLsResult.fileList.map((file, index) => ({
            url: file.tempFileURL,
            type: providerShowcase.mediaCloudItems[index].type,
            fileID: file.fileID
            // 保存 cloud ID
          }));
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:295", "获取媒体临时链接失败:", err);
          media.value = [];
        }
      } else {
        media.value = [];
      }
      selectedCategories.value = mapCategories(providerShowcase.categories || []);
    }
    async function getNavData() {
      try {
        const res = await common_vendor.tr.callFunction({ name: "getNavData" });
        const arr = res.result.data || [];
        navArr.value = arr;
        categories.value = arr.map((i) => i.classname);
        if (providerShowcase.categories.length) {
          selectedCategories.value = mapCategories(providerShowcase.categories);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:316", err);
        common_vendor.index.showToast({ title: "分类加载失败", icon: "none" });
      }
    }
    function mapCategories(ids) {
      return ids.map((id) => navArr.value.find((c) => c._id === id)).filter(Boolean);
    }
    function onCategorySelect(e) {
      const idx = e.detail.value;
      const cat = navArr.value[idx];
      let sel = [...selectedCategories.value];
      if (!sel.some((c) => c._id === cat._id) && sel.length >= 5) {
        return common_vendor.index.showToast({ title: "最多选择 5 个", icon: "none" });
      }
      if (sel.some((c) => c._id === cat._id)) {
        sel = sel.filter((c) => c._id !== cat._id);
      } else {
        sel.push(cat);
      }
      selectedCategories.value = sel;
      providerShowcase.categories = sel.map((c) => c._id);
    }
    function removeCategory(index) {
      const sel = [...selectedCategories.value];
      sel.splice(index, 1);
      selectedCategories.value = sel;
      providerShowcase.categories = sel.map((c) => c._id);
    }
    function addMedia() {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image", "video"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const f = res.tempFiles[0];
          const ext = f.fileType === "video" ? "mp4" : f.tempFilePath.split(".").pop() || "jpg";
          const cloudPath = `Homepage/media/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`;
          common_vendor.tr.uploadFile({
            filePath: f.tempFilePath,
            cloudPath,
            success: async (up) => {
              common_vendor.index.__f__("log", "at pages/Homepage/Homepage.vue:365", "上传文件成功，fileID:", up.fileID);
              const newCloudFileID = up.fileID;
              providerShowcase.mediaCloudItems.push({ src: newCloudFileID, type: f.fileType || "image" });
              try {
                const tempURLResult = await common_vendor.tr.getTempFileURL({
                  fileList: [newCloudFileID]
                });
                if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
                  const tempFileURL = tempURLResult.fileList[0].tempFileURL;
                  media.value.push({ url: tempFileURL, type: f.fileType || "image", fileID: newCloudFileID });
                  common_vendor.index.showToast({ title: "上传成功", icon: "success" });
                } else {
                  common_vendor.index.showToast({ title: "获取临时链接失败，请重试", icon: "none" });
                }
              } catch (tempErr) {
                common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:384", "上传后获取临时链接失败:", tempErr);
                common_vendor.index.showToast({ title: "上传后处理失败", icon: "none" });
              }
            },
            fail: (e) => {
              common_vendor.index.showToast({ title: "上传失败: " + e.message, icon: "none" });
              common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:390", "上传失败:", e);
            }
          });
        }
      });
    }
    function uploadSingleBannerImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          const fp = res.tempFilePaths[0];
          const ext = fp.split(".").pop() || "jpg";
          const cloudPath = `Homepage/banners/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`;
          common_vendor.tr.uploadFile({
            filePath: fp,
            cloudPath,
            success: async (up) => {
              common_vendor.index.__f__("log", "at pages/Homepage/Homepage.vue:409", "上传轮播图成功，fileID:", up.fileID);
              const newCloudFileID = up.fileID;
              providerShowcase.bannerCloudIDs.push(newCloudFileID);
              try {
                const tempURLResult = await common_vendor.tr.getTempFileURL({
                  fileList: [newCloudFileID]
                });
                if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
                  const tempFileURL = tempURLResult.fileList[0].tempFileURL;
                  bannerImages.value.push({ url: tempFileURL, fileID: newCloudFileID });
                  common_vendor.index.showToast({ title: "上传成功", icon: "success" });
                } else {
                  common_vendor.index.showToast({ title: "获取临时链接失败，请重试", icon: "none" });
                }
              } catch (tempErr) {
                common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:428", "上传后获取临时链接失败:", tempErr);
                common_vendor.index.showToast({ title: "上传后处理失败", icon: "none" });
              }
            },
            fail: (e) => {
              common_vendor.index.showToast({ title: "上传失败: " + e.message, icon: "none" });
              common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:434", "上传失败:", e);
            }
          });
        }
      });
    }
    function selectServiceArea() {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => getLocation()
      });
    }
    function getLocation() {
      common_vendor.index.showLoading({ title: "定位...", mask: true });
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (loc) => {
          const { latitude, longitude } = loc;
          providerShowcase.latitude = latitude;
          providerShowcase.longitude = longitude;
          qqmapsdk.reverseGeocoder({
            location: { latitude, longitude },
            success: (r) => {
              common_vendor.index.hideLoading();
              const comp = r.result.address_component;
              const district = comp.district || "";
              const town = comp.town || "";
              const street = comp.street || "";
              let area = district;
              if (town)
                area += `·${town}`;
              else if (street)
                area += `·${street}`;
              if (!area)
                area = "未知";
              providerShowcase.serviceArea = area;
            },
            fail: () => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "地址解析失败", icon: "none" });
            }
          });
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "定位失败", icon: "none" });
        }
      });
    }
    function onMaxServiceDistanceBlur() {
      let v = providerShowcase.maxServiceDistance;
      if (isNaN(v) || v <= 0) {
        common_vendor.index.showToast({ title: "请输入正确的距离", icon: "none" });
        providerShowcase.maxServiceDistance = 1;
      } else if (v > 10) {
        common_vendor.index.showToast({ title: "最大距离不能超过 10km", icon: "none" });
        providerShowcase.maxServiceDistance = 10;
      } else {
        providerShowcase.maxServiceDistance = Math.round(v * 10) / 10;
      }
    }
    async function saveProviderShowcase() {
      if (!validateUserInfo(userInfo))
        return;
      common_vendor.index.showLoading({ title: "保存中...", mask: true });
      const updateData = {
        phoneNumber: providerShowcase.phoneNumber,
        accountPhoneNumber: userInfo.phoneNumber,
        userId: userInfo._id,
        // 直接使用 providerShowcase 中的 cloud:// ID 数组
        bannerImages: providerShowcase.bannerCloudIDs,
        media: providerShowcase.mediaCloudItems,
        // 存储 {src: cloud://, type: string}
        age: providerShowcase.age,
        serviceArea: providerShowcase.serviceArea,
        latitude: providerShowcase.latitude,
        longitude: providerShowcase.longitude,
        maxServiceDistance: providerShowcase.maxServiceDistance,
        skills: providerShowcase.skills,
        price: providerShowcase.price,
        description: providerShowcase.description,
        categories: providerShowcase.categories,
        avatar: userInfo.avatar,
        name: userInfo.name
      };
      try {
        const res = await common_vendor.tr.callFunction({
          name: "updateHomepage",
          data: {
            action: "update",
            phoneNumber: userInfo.phoneNumber,
            data: updateData
          }
        });
        common_vendor.index.hideLoading();
        if (res.result.success) {
          common_vendor.index.showToast({ title: "保存成功", icon: "success" });
          await loadHomepageData(userInfo.phoneNumber);
        } else {
          common_vendor.index.showToast({ title: res.result.error || "保存失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:545", "保存失败:", err);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      }
    }
    function showAddTagInput() {
      showTagInput.value = true;
      newTagText.value = "";
    }
    function confirmAddTag() {
      const newTag = newTagText.value.trim();
      if (newTag) {
        providerShowcase.skills.push(newTag);
        showTagInput.value = false;
        newTagText.value = "";
      }
    }
    function cancelAddTag() {
      showTagInput.value = false;
      newTagText.value = "";
    }
    function onSkillLongPress(index) {
      common_vendor.index.showActionSheet({
        itemList: ["删除该项"],
        success: () => {
          providerShowcase.skills.splice(index, 1);
        }
      });
    }
    function onBannerTap(index) {
      common_vendor.index.previewImage({
        urls: bannerImages.value.map((item) => item.url),
        // 预览使用临时 URL
        current: bannerImages.value[index].url
      });
    }
    async function onBannerLongPress(index) {
      common_vendor.index.showActionSheet({
        itemList: ["删除该图片"],
        success: async () => {
          const fileIdToDelete = bannerImages.value[index].fileID;
          common_vendor.index.showLoading({ title: "删除中...", mask: true });
          try {
            const res = await common_vendor.tr.callFunction({
              name: "deleteFile",
              // 你创建的删除文件的云函数名称
              data: { fileId: fileIdToDelete }
            });
            if (res.result && res.result.success) {
              bannerImages.value.splice(index, 1);
              const cloudIndex = providerShowcase.bannerCloudIDs.indexOf(fileIdToDelete);
              if (cloudIndex > -1) {
                providerShowcase.bannerCloudIDs.splice(cloudIndex, 1);
              }
              await saveProviderShowcase();
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
            } else {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: res.result.message || "云存储文件删除失败", icon: "none" });
              common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:620", "云存储文件删除失败:", res.result);
            }
          } catch (err) {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:624", "删除轮播图失败:", err);
            common_vendor.index.showToast({ title: "删除失败: " + err.message, icon: "none" });
          }
        }
      });
    }
    async function onMediaLongPress(index) {
      common_vendor.index.showActionSheet({
        itemList: ["删除该内容"],
        success: async () => {
          const fileIdToDelete = media.value[index].fileID;
          common_vendor.index.showLoading({ title: "删除中...", mask: true });
          try {
            const res = await common_vendor.tr.callFunction({
              name: "deleteFile",
              // 你创建的删除文件的云函数名称
              data: { fileId: fileIdToDelete }
            });
            if (res.result && res.result.success) {
              media.value.splice(index, 1);
              const cloudIndex = providerShowcase.mediaCloudItems.findIndex((item) => item.src === fileIdToDelete);
              if (cloudIndex > -1) {
                providerShowcase.mediaCloudItems.splice(cloudIndex, 1);
              }
              await saveProviderShowcase();
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
            } else {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: res.result.message || "云存储文件删除失败", icon: "none" });
              common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:661", "云存储文件删除失败:", res.result);
            }
          } catch (err) {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/Homepage/Homepage.vue:665", "删除媒体失败:", err);
            common_vendor.index.showToast({ title: "删除失败: " + err.message, icon: "none" });
          }
        }
      });
    }
    function openAgeInput() {
      showAgeInput.value = true;
      tempAge.value = providerShowcase.age;
    }
    function confirmAgeInput() {
      if (!/^\d+$/.test(tempAge.value)) {
        common_vendor.index.showToast({ title: "请输入有效数字", icon: "none" });
        return;
      }
      providerShowcase.age = tempAge.value;
      showAgeInput.value = false;
    }
    function cancelAgeInput() {
      showAgeInput.value = false;
    }
    common_vendor.onMounted(() => {
      loadHomepageData(userInfo.phoneNumber);
      getNavData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !providerShowcase || Object.keys(providerShowcase).length === 0
      }, !providerShowcase || Object.keys(providerShowcase).length === 0 ? {
        b: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : common_vendor.e({
        c: common_vendor.f(bannerImages.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => onBannerTap(index), index),
            c: common_vendor.o(($event) => onBannerLongPress(index), index),
            d: index
          };
        }),
        d: bannerImages.value.length === 0
      }, bannerImages.value.length === 0 ? {} : {}, {
        e: common_vendor.t(bannerImages.value.length ? "管理轮播图" : "上传轮播图"),
        f: common_vendor.o(uploadSingleBannerImage),
        g: selectedCategories.value.length === 0
      }, selectedCategories.value.length === 0 ? {} : {}, {
        h: common_vendor.f(selectedCategories.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.classname),
            b: common_vendor.o(($event) => removeCategory(index), index),
            c: index
          };
        }),
        i: categories.value,
        j: common_vendor.o(onCategorySelect),
        k: common_vendor.unref(userInfo).avatar,
        l: common_vendor.t(common_vendor.unref(userInfo).name),
        m: common_vendor.t(providerShowcase.age ? providerShowcase.age + "岁" : "请填写年龄"),
        n: common_vendor.o(openAgeInput),
        o: common_vendor.t(providerShowcase.serviceArea || "请选择服务区域"),
        p: showAgeInput.value
      }, showAgeInput.value ? {
        q: tempAge.value,
        r: common_vendor.o(($event) => tempAge.value = $event.detail.value),
        s: common_vendor.o(cancelAgeInput),
        t: common_vendor.o(confirmAgeInput)
      } : {}, {
        v: common_vendor.t(providerShowcase.serviceArea || "点击选择服务区域"),
        w: common_vendor.o(selectServiceArea),
        x: common_vendor.o(onMaxServiceDistanceBlur),
        y: providerShowcase.maxServiceDistance,
        z: common_vendor.o(common_vendor.m(($event) => providerShowcase.maxServiceDistance = $event.detail.value, {
          number: true
        })),
        A: providerShowcase.phoneNumber,
        B: common_vendor.o(($event) => providerShowcase.phoneNumber = $event.detail.value),
        C: providerShowcase.skills.length === 0
      }, providerShowcase.skills.length === 0 ? {} : {}, {
        D: common_vendor.f(providerShowcase.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: index,
            c: common_vendor.o(($event) => onSkillLongPress(index), index)
          };
        }),
        E: common_vendor.o(showAddTagInput),
        F: providerShowcase.price,
        G: common_vendor.o(($event) => providerShowcase.price = $event.detail.value),
        H: providerShowcase.description,
        I: common_vendor.o(($event) => providerShowcase.description = $event.detail.value),
        J: media.value.length === 0
      }, media.value.length === 0 ? {} : {}, {
        K: common_vendor.f(media.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "image"
          }, item.type === "image" ? {
            b: item.url
          } : {}, {
            c: item.type === "video"
          }, item.type === "video" ? {
            d: item.url
          } : {}, {
            e: index,
            f: common_vendor.o(($event) => onMediaLongPress(index), index)
          });
        }),
        L: common_vendor.o(addMedia),
        M: common_vendor.o(saveProviderShowcase),
        N: showTagInput.value
      }, showTagInput.value ? {
        O: newTagText.value,
        P: common_vendor.o(($event) => newTagText.value = $event.detail.value),
        Q: common_vendor.o(cancelAddTag),
        R: common_vendor.o(confirmAddTag)
      } : {}));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d71a3e1b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Homepage/Homepage.js.map
