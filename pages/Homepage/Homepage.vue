<template>
  <view class="homepage-container">
    <view style="padding:50rpx 30rpx; min-height: 50vh;" v-if="!providerShowcase || Object.keys(providerShowcase).length === 0">
      <view class="skeleton-title"></view>
      <view class="skeleton-row" v-for="i in 5" :key="i"></view>
    </view>

    <view v-else class="worker-detail">
      <swiper class="banner-swiper" autoplay interval="3000" circular indicator-dots>
        <swiper-item v-for="(item, index) in bannerImages" :key="index">
          <image
            :src="item.url"
            class="banner-image"
            @click="onBannerTap(index)"
            @longpress="onBannerLongPress(index)"
            mode="aspectFill"
          />
        </swiper-item>
        <swiper-item v-if="bannerImages.length === 0">
          <view class="empty-banner">
            <text>点击下方按钮上传展示图片</text>
          </view>
        </swiper-item>
      </swiper>

      <view class="upload-banner-btn" @click="uploadSingleBannerImage">
        <text>{{ bannerImages.length ? '管理轮播图' : '上传轮播图' }}</text>
      </view>

      <view class="category-section">
        <view class="section-title">服务分类（最多5个）</view>
        <view class="category-selector">
          <view class="selected-categories">
            <text v-if="selectedCategories.length === 0" class="placeholder-text">请选择服务分类</text>
            <view v-for="(item, index) in selectedCategories" :key="index" class="category-tag">
              <text>{{ item.classname }}</text>
              <text class="remove-btn" @click="removeCategory(index)">×</text>
            </view>
          </view>
          <picker mode="selector" :range="categories" @change="onCategorySelect">
            <view class="picker-btn">
              <text>+ 添加分类</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="basic-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="info-text">
          <view class="name">{{ userInfo.name }}</view>
          <view class="tags">
            <view class="editable-field" @click="openAgeInput">
              {{ providerShowcase.age ? providerShowcase.age + '岁' : '请填写年龄' }}
            </view>
          </view>
          <view class="area">
            {{ providerShowcase.serviceArea || '请选择服务区域' }}
          </view>
        </view>
      </view>

      <view class="input-mask" v-if="showAgeInput">
        <view class="input-box">
          <view class="input-header">编辑年龄</view>
          <input
            class="tag-input"
            placeholder="请输入年龄（数字）"
            type="number"
            v-model="tempAge"
          />
          <view class="input-actions">
            <view class="action-btn cancel" @click="cancelAgeInput">取消</view>
            <view class="action-btn confirm" @click="confirmAgeInput">确定</view>
          </view>
        </view>
      </view>

      <view class="input-section">
        <view class="section-title">服务区域</view>
        <view class="service-area">
          <text>{{ providerShowcase.serviceArea || '点击选择服务区域' }}</text>
          <button class="select-area-btn" @click="selectServiceArea">选择区域</button>
        </view>
      </view>
	  
	  <view class="input-section"> <view class="section-title">最远可服务距离（km）</view>
          <input
            class="common-input"
            type="number"
            inputmode="decimal"
            step="0.1"
            max="10"
            v-model.number="providerShowcase.maxServiceDistance"
            placeholder="请输入最远服务距离，1~10 之间"
            @blur="onMaxServiceDistanceBlur"
          />
      </view>

      <view class="input-section">
        <view class="section-title">手机号</view>
        <input
          class="common-input"
          type="number"
          placeholder="请输入手机号"
          v-model="providerShowcase.phoneNumber"
        />
      </view>

      <view class="service-section">
        <view class="section-title">服务项目</view>
        <view class="tag-list">
          <view v-if="providerShowcase.skills.length === 0" class="empty-tips">点击下方 + 添加服务项目</view>
          <view v-for="(skill, index) in providerShowcase.skills" :key="index" class="tag-item" @longpress="onSkillLongPress(index)">
            <text class="skill-tag">{{ skill }}</text>
          </view>
          <view class="add-tag" @click="showAddTagInput">+</view>
        </view>
      </view>

      <view class="input-section">
        <view class="section-title">服务报价</view>
        <input
          class="common-input"
          v-model="providerShowcase.price"
          placeholder="请输入服务价格（示例：300元/天）"
        />
      </view>

      <view class="input-section">
        <view class="section-title">个人简介</view>
        <textarea
          class="common-textarea"
          v-model="providerShowcase.description"
          placeholder="请描述您的专业技能和服务特色..."
        />
      </view>

      <view class="case-section">
        <view class="section-title">案例展示</view>
        <view class="media-list">
          <view v-if="media.length === 0" class="empty-tips">点击 + 上传施工案例（图片/视频）</view>
          <view v-for="(item, index) in media" :key="index" class="media-item" @longpress="onMediaLongPress(index)">
            <image v-if="item.type === 'image'" :src="item.url" mode="aspectFill" />
            <video v-if="item.type === 'video'" :src="item.url" controls />
          </view>
          <view class="add-tag" @click="addMedia">+</view>
        </view>
      </view>

      <view class="save-btn" @click="saveProviderShowcase">保存信息</view>

      <view class="input-mask" v-if="showTagInput">
        <view class="input-box">
          <view class="input-header">添加服务项目</view>
          <input
            class="tag-input"
            placeholder="请输入服务内容（最多12字）"
            maxlength="12"
            v-model="newTagText"
          />
          <view class="input-actions">
            <view class="action-btn cancel" @click="cancelAddTag">取消</view>
            <view class="action-btn confirm" @click="confirmAddTag">确定</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 仅在微信小程序和 App-PLUS 环境下初始化 QQMap
let qqmapsdk = null
// #ifdef MP-WEIXIN || APP-PLUS
const QQMapWX = require('../../static/js/qqmap-wx-jssdk.js')
qqmapsdk = new QQMapWX({
  key: 'ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46'
})
// #endif

// 从本地存储读取用户信息
const userInfo = uni.getStorageSync('userinfo') || {}

// 校验用户信息
function validateUserInfo(info) {
  return info.phoneNumber && info.name && info.avatar
}

if (!validateUserInfo(userInfo)) {
  uni.showToast({ title: '用户信息不完整', icon: 'none' })
}

// 响应式数据
const providerShowcase = reactive({
  age: '',
  serviceArea: '',
  latitude: null,
  longitude: null,
  maxServiceDistance: 10,
  skills: [],
  price: '',
  description: '',
  categories: [],
  phoneNumber: userInfo.phoneNumber || '',
  // 数据库中存储的 bannerImages 和 media 的 cloud:// ID
  bannerCloudIDs: [], // 新增：存储轮播图的 cloud:// ID
  mediaCloudItems: [] // 新增：存储媒体的 cloud:// ID 和类型，格式为 [{ src: 'cloud://', type: 'image' }]
})

// 用于前端渲染的 bannerImages 和 media, 存储临时 HTTPS URL
const bannerImages = ref([]) // 格式：[{ url: 'https://...', fileID: 'cloud://...' }]
const media = ref([]) // 格式：[{ url: 'https://...', type: 'image', fileID: 'cloud://...' }]

const navArr = ref([])
const categories = ref([])
const selectedCategories = ref([])
const showTagInput = ref(false)
const newTagText = ref('')
const showAgeInput = ref(false)
const tempAge = ref('')

// 云开发环境 ID（根据你的实际环境 ID 修改）
const cloudEnv = 'mp-1240ebd5-749c-4abc-b593-fd807f0347fb'

// 加载主页数据
async function loadHomepageData(phoneNumber) {
  try {
    const res = await uniCloud.callFunction({
      name: 'getHomepage',
      data: { phoneNumber }
    })
    if (res.result.success) {
      await updatePageData(res.result.data || {}) // 确保等待 updatePageData 完成
    } else {
      uni.showToast({ title: '数据加载失败', icon: 'none' })
    }
  } catch (err) {
    console.error('加载失败:', err)
    uni.showToast({ title: '加载出错', icon: 'none' })
  }
}

// 更新页面数据
async function updatePageData(cloudData) {
  Object.assign(providerShowcase, {
    age: cloudData.age || '',
    serviceArea: cloudData.serviceArea || '',
    latitude: cloudData.latitude || null,
    longitude: cloudData.longitude || null,
    maxServiceDistance: cloudData.maxServiceDistance || 10,
    skills: cloudData.skills || [],
    price: cloudData.price || '',
    description: cloudData.description || '',
    categories: cloudData.categories || [],
    phoneNumber: cloudData.phoneNumber || providerShowcase.phoneNumber,
    // 从数据库加载原始 cloud:// ID 到 providerShowcase
    bannerCloudIDs: cloudData.bannerImages || [],
    mediaCloudItems: cloudData.media || []
  })

  // 将 bannerCloudIDs 转换为临时 URL 供前端渲染
  if (providerShowcase.bannerCloudIDs.length > 0) {
    try {
      const tempFileURLsResult = await uniCloud.getTempFileURL({
        fileList: providerShowcase.bannerCloudIDs,
      })
      bannerImages.value = tempFileURLsResult.fileList.map(file => ({
        url: file.tempFileURL,
        fileID: file.fileID // 保存 cloud ID 以便后续操作，如删除
      }))
    } catch (err) {
      console.error('获取轮播图临时链接失败:', err)
      bannerImages.value = []
    }
  } else {
    bannerImages.value = []
  }

  // 将 mediaCloudItems 转换为临时 URL 供前端渲染
  if (providerShowcase.mediaCloudItems.length > 0) {
    const mediaFileIDs = providerShowcase.mediaCloudItems.map(item => item.src)
    try {
      const tempMediaURLsResult = await uniCloud.getTempFileURL({
        fileList: mediaFileIDs,
      })
      media.value = tempMediaURLsResult.fileList.map((file, index) => ({
        url: file.tempFileURL,
        type: providerShowcase.mediaCloudItems[index].type,
        fileID: file.fileID // 保存 cloud ID
      }))
    } catch (err) {
      console.error('获取媒体临时链接失败:', err)
      media.value = []
    }
  } else {
    media.value = []
  }

  selectedCategories.value = mapCategories(providerShowcase.categories || [])
}

// 获取导航数据
async function getNavData() {
  try {
    const res = await uniCloud.callFunction({ name: 'getNavData' })
    const arr = res.result.data || []
    navArr.value = arr
    categories.value = arr.map(i => i.classname)
    if (providerShowcase.categories.length) {
      selectedCategories.value = mapCategories(providerShowcase.categories)
    }
  } catch (err) {
    console.error(err)
    uni.showToast({ title: '分类加载失败', icon: 'none' })
  }
}

// 映射分类
function mapCategories(ids) {
  return ids.map(id => navArr.value.find(c => c._id === id)).filter(Boolean)
}

// 选择分类
function onCategorySelect(e) {
  const idx = e.detail.value
  const cat = navArr.value[idx]
  let sel = [...selectedCategories.value]
  if (!sel.some(c => c._id === cat._id) && sel.length >= 5) {
    return uni.showToast({ title: '最多选择 5 个', icon: 'none' })
  }
  if (sel.some(c => c._id === cat._id)) {
    sel = sel.filter(c => c._id !== cat._id)
  } else {
    sel.push(cat)
  }
  selectedCategories.value = sel
  providerShowcase.categories = sel.map(c => c._id)
}

// 删除分类
function removeCategory(index) {
  const sel = [...selectedCategories.value]
  sel.splice(index, 1)
  selectedCategories.value = sel
  providerShowcase.categories = sel.map(c => c._id)
}

// 添加媒体 (上传后立即获取临时 URL)
function addMedia() {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image', 'video'],
    sourceType: ['album', 'camera'],
    success: res => {
      const f = res.tempFiles[0]
      const ext = f.fileType === 'video' ? 'mp4' : (f.tempFilePath.split('.').pop() || 'jpg')
      const cloudPath = `Homepage/media/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`
      uniCloud.uploadFile({
        filePath: f.tempFilePath,
        cloudPath: cloudPath,
        success: async up => {
          console.log('上传文件成功，fileID:', up.fileID)
          const newCloudFileID = up.fileID // 这是 cloud:// 格式

          // 1. 将 cloud:// ID 存储到 providerShowcase 中（数据库同步时使用）
          providerShowcase.mediaCloudItems.push({ src: newCloudFileID, type: f.fileType || 'image' })

          // 2. 获取临时 URL 并更新 media.value (用于前端渲染)
          try {
            const tempURLResult = await uniCloud.getTempFileURL({
              fileList: [newCloudFileID],
            })
            if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
              const tempFileURL = tempURLResult.fileList[0].tempFileURL
              media.value.push({ url: tempFileURL, type: f.fileType || 'image', fileID: newCloudFileID })
              uni.showToast({ title: '上传成功', icon: 'success' })
            } else {
              uni.showToast({ title: '获取临时链接失败，请重试', icon: 'none' })
            }
          } catch (tempErr) {
            console.error('上传后获取临时链接失败:', tempErr)
            uni.showToast({ title: '上传后处理失败', icon: 'none' })
          }
        },
        fail: e => {
          uni.showToast({ title: '上传失败: ' + e.message, icon: 'none' })
          console.error('上传失败:', e)
        }
      })
    }
  })
}

// 上传轮播图 (上传后立即获取临时 URL)
function uploadSingleBannerImage() {
  uni.chooseImage({
    count: 1,
    success: res => {
      const fp = res.tempFilePaths[0]
      const ext = fp.split('.').pop() || 'jpg'
      const cloudPath = `Homepage/banners/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`
      uniCloud.uploadFile({
        filePath: fp,
        cloudPath: cloudPath,
        success: async up => {
          console.log('上传轮播图成功，fileID:', up.fileID)
          const newCloudFileID = up.fileID // 这是 cloud:// 格式

          // 1. 将 cloud:// ID 存储到 providerShowcase 中（数据库同步时使用）
          providerShowcase.bannerCloudIDs.push(newCloudFileID)

          // 2. 获取临时 URL 并更新 bannerImages.value (用于前端渲染)
          try {
            const tempURLResult = await uniCloud.getTempFileURL({
              fileList: [newCloudFileID],
            })
            if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
              const tempFileURL = tempURLResult.fileList[0].tempFileURL
              bannerImages.value.push({ url: tempFileURL, fileID: newCloudFileID })
              uni.showToast({ title: '上传成功', icon: 'success' })
            } else {
              uni.showToast({ title: '获取临时链接失败，请重试', icon: 'none' })
            }
          } catch (tempErr) {
            console.error('上传后获取临时链接失败:', tempErr)
            uni.showToast({ title: '上传后处理失败', icon: 'none' })
          }
        },
        fail: e => {
          uni.showToast({ title: '上传失败: ' + e.message, icon: 'none' })
          console.error('上传失败:', e)
        }
      })
    }
  })
}

// 选择服务区域
function selectServiceArea() {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => getLocation()
  })
}

// 获取位置
function getLocation() {
  uni.showLoading({ title: '定位...', mask: true })
  uni.getLocation({
    type: 'gcj02',
    success: loc => {
      const { latitude, longitude } = loc
      providerShowcase.latitude = latitude
      providerShowcase.longitude = longitude
      // #ifdef MP-WEIXIN || APP-PLUS
      qqmapsdk.reverseGeocoder({
        location: { latitude, longitude },
        success: r => {
          uni.hideLoading()
          const comp = r.result.address_component
          const district = comp.district || ''
          const town = comp.town || ''
          const street = comp.street || ''
          let area = district
          if (town) area += `·${town}`
          else if (street) area += `·${street}`
          if (!area) area = '未知'
          providerShowcase.serviceArea = area
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '地址解析失败', icon: 'none' })
        }
      })
      // #endif
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '定位失败', icon: 'none' })
    }
  })
}

// 失焦时校验最远可服务距离
function onMaxServiceDistanceBlur() {
  let v = providerShowcase.maxServiceDistance
  if (isNaN(v) || v <= 0) {
    uni.showToast({ title: '请输入正确的距离', icon: 'none' })
    providerShowcase.maxServiceDistance = 1
  } else if (v > 10) {
    uni.showToast({ title: '最大距离不能超过 10km', icon: 'none' })
    providerShowcase.maxServiceDistance = 10
  } else {
    providerShowcase.maxServiceDistance = Math.round(v * 10) / 10
  }
}

// 保存展示数据
async function saveProviderShowcase() {
  if (!validateUserInfo(userInfo)) return
  uni.showLoading({ title: '保存中...', mask: true })

  const updateData = {
    phoneNumber: providerShowcase.phoneNumber,
    accountPhoneNumber: userInfo.phoneNumber,
    userId: userInfo._id,
    // 直接使用 providerShowcase 中的 cloud:// ID 数组
    bannerImages: providerShowcase.bannerCloudIDs,
    media: providerShowcase.mediaCloudItems, // 存储 {src: cloud://, type: string}
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
  }

  try {
    const res = await uniCloud.callFunction({
      name: 'updateHomepage',
      data: {
        action: 'update',
        phoneNumber: userInfo.phoneNumber,
        data: updateData
      }
    })
    uni.hideLoading()
    if (res.result.success) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      // 保存成功后，重新加载数据以确保页面显示的是最新的临时链接
      await loadHomepageData(userInfo.phoneNumber)
    } else {
      uni.showToast({ title: res.result.error || '保存失败', icon: 'none' })
    }
  } catch (err) {
    uni.hideLoading()
    console.error('保存失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

// 显示添加标签
function showAddTagInput() {
  showTagInput.value = true
  newTagText.value = ''
}

// 确认添加标签
function confirmAddTag() {
  const newTag = newTagText.value.trim()
  if (newTag) {
    providerShowcase.skills.push(newTag)
    showTagInput.value = false
    newTagText.value = ''
  }
}

// 取消添加标签
function cancelAddTag() {
  showTagInput.value = false
  newTagText.value = ''
}

// 长按删除技能
function onSkillLongPress(index) {
  uni.showActionSheet({
    itemList: ['删除该项'],
    success: () => {
      providerShowcase.skills.splice(index, 1)
    }
  })
}

// 预览轮播图
function onBannerTap(index) {
  uni.previewImage({
    urls: bannerImages.value.map(item => item.url), // 预览使用临时 URL
    current: bannerImages.value[index].url
  })
}

// 长按删除轮播图
async function onBannerLongPress(index) {
  uni.showActionSheet({
    itemList: ['删除该图片'],
    success: async () => {
      const fileIdToDelete = bannerImages.value[index].fileID; // 获取 cloud:// ID
      uni.showLoading({ title: '删除中...', mask: true }); // 显示加载提示

      try {
        // *** 关键修改：通过云函数调用删除文件 ***
        const res = await uniCloud.callFunction({
          name: 'deleteFile', // 你创建的删除文件的云函数名称
          data: { fileId: fileIdToDelete }
        });

        if (res.result && res.result.success) {
          // 云存储文件删除成功，再更新前端数据和数据库
          bannerImages.value.splice(index, 1); // 从渲染数据中移除

          // 从 providerShowcase.bannerCloudIDs 中移除对应的 fileID
          const cloudIndex = providerShowcase.bannerCloudIDs.indexOf(fileIdToDelete);
          if (cloudIndex > -1) {
            providerShowcase.bannerCloudIDs.splice(cloudIndex, 1);
          }
          await saveProviderShowcase(); // 保存更改到数据库
          uni.hideLoading(); // 隐藏加载提示
          uni.showToast({ title: '删除成功', icon: 'success' });
        } else {
          uni.hideLoading(); // 隐藏加载提示
          uni.showToast({ title: res.result.message || '云存储文件删除失败', icon: 'none' });
          console.error('云存储文件删除失败:', res.result);
        }
      } catch (err) {
        uni.hideLoading(); // 隐藏加载提示
        console.error('删除轮播图失败:', err);
        uni.showToast({ title: '删除失败: ' + err.message, icon: 'none' });
      }
    }
  });
}

// 长按删除媒体
async function onMediaLongPress(index) {
  uni.showActionSheet({
    itemList: ['删除该内容'],
    success: async () => {
      const fileIdToDelete = media.value[index].fileID; // 获取 cloud:// ID
      uni.showLoading({ title: '删除中...', mask: true }); // 显示加载提示

      try {
        // *** 关键修改：通过云函数调用删除文件 ***
        const res = await uniCloud.callFunction({
          name: 'deleteFile', // 你创建的删除文件的云函数名称
          data: { fileId: fileIdToDelete }
        });

        if (res.result && res.result.success) {
          // 云存储文件删除成功，再更新前端数据和数据库
          media.value.splice(index, 1); // 从渲染数据中移除

          // 从 providerShowcase.mediaCloudItems 中移除对应的 fileID
          const cloudIndex = providerShowcase.mediaCloudItems.findIndex(item => item.src === fileIdToDelete);
          if (cloudIndex > -1) {
            providerShowcase.mediaCloudItems.splice(cloudIndex, 1);
          }
          await saveProviderShowcase(); // 保存更改到数据库
          uni.hideLoading(); // 隐藏加载提示
          uni.showToast({ title: '删除成功', icon: 'success' });
        } else {
          uni.hideLoading(); // 隐藏加载提示
          uni.showToast({ title: res.result.message || '云存储文件删除失败', icon: 'none' });
          console.error('云存储文件删除失败:', res.result);
        }
      } catch (err) {
        uni.hideLoading(); // 隐藏加载提示
        console.error('删除媒体失败:', err);
        uni.showToast({ title: '删除失败: ' + err.message, icon: 'none' });
      }
    }
  });
}


// 显示年龄输入
function openAgeInput() {
  showAgeInput.value = true
  tempAge.value = providerShowcase.age
}

// 确认年龄
function confirmAgeInput() {
  if (!/^\d+$/.test(tempAge.value)) {
    uni.showToast({ title: '请输入有效数字', icon: 'none' })
    return
  }
  providerShowcase.age = tempAge.value
  showAgeInput.value = false
}

// 取消年龄输入
function cancelAgeInput() {
  showAgeInput.value = false
}

onMounted(() => {
  loadHomepageData(userInfo.phoneNumber)
  getNavData()
})
</script>


<style scoped>
/* Base container */
.homepage-container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
  overflow-x: hidden;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  padding: 24rpx;
  border-bottom: 1rpx solid #eee;
}

/* 骨架屏样式 */
.skeleton-title {
  width: 60%;
  height: 40rpx;
  margin: 0 auto 20rpx;
  background: #eee;
  border-radius: 8rpx;
}
.skeleton-row {
  width: 100%;
  height: 32rpx;
  margin-bottom: 16rpx;
  background: #eee;
  border-radius: 6rpx;
}

/* Input section */
.input-section {
  background: #fff;
  margin: 24rpx 0;
  padding: 0 30rpx 24rpx;
}

.common-input {
  width: calc(100% - 48rpx);
  height: 88rpx;
  padding: 0 25rpx;
  margin: 0 auto;
  background: #f8f8f8;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #333;
  display: block;
  transition: all 0.2s ease;
}

.common-input:focus {
  border-color: #FFA500;
  box-shadow: 0 4rpx 12rpx rgba(255, 165, 0, 0.1);
}

.common-input::placeholder {
  color: #c0c0c0;
  font-size: 28rpx;
}

.common-textarea {
  width: calc(100% - 48rpx);
  height: 240rpx;
  padding: 28rpx 25rpx;
  margin: 0 auto;
  background: #f8f8f8;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
  display: block;
}

.common-textarea:focus {
  border-color: #FFA500;
  box-shadow: 0 4rpx 12rpx rgba(255, 165, 0, 0.1);
}

.common-textarea::placeholder {
  color: #c0c0c0;
  font-size: 28rpx;
}

/* Banner section */
.banner-swiper {
  height: 420rpx;
  background: #eee;
}

.empty-banner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 28rpx;
}

.upload-banner-btn {
  margin: 24rpx;
  padding: 16rpx;
  background: #fff;
  border: 2rpx dashed #FFA500;
  border-radius: 8rpx;
  text-align: center;
}

.upload-banner-btn text {
  color: #FFA500;
  font-size: 28rpx;
}

/* Category section */
.category-section {
  background: #fff;
  margin: 24rpx 0;
}

.category-selector {
  padding: 0 24rpx 24rpx;
}

.picker-btn {
  background: #f8f8f8;
  padding: 16rpx;
  border-radius: 8rpx;
  text-align: center;
}

.picker-btn text {
  color: #FFA500;
}

.selected-categories {
  margin-bottom: 24rpx;
  margin-top: 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.placeholder-text {
  color: #999;
  font-size: 28rpx;
}

/* Basic info */
.basic-info {
  padding: 24rpx;
  background: #fff;
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.info-text {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.tags, .area {
  color: #666;
  font-size: 28rpx;
}

.tags::before, .area::before {
  content: '▶';
  color: #FFA500;
  margin-right: 8rpx;
  font-size: 24rpx;
}

/* Editable fields */
.editable-field {
  position: relative;
  display: inline-block;
  padding: 0 8rpx;
  border-radius: 8rpx;
}

.editable-field:active {
  background: #f0f0f0;
}

.editable-field::after {
  content: '✎';
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #FFA500;
  opacity: 0.8;
}

.tags .editable-field {
  color: #FFA500;
}

/* Service section */
.service-section {
  background: #fff;
  margin: 24rpx 0;
}

.tag-list {
  padding: 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.empty-tips {
  width: 100%;
  color: #999;
  text-align: center;
  padding: 24rpx 0;
}

.tag-item {
  background: #f8f8f8;
  border-radius: 40rpx;
  padding: 12rpx 24rpx;
}

.skill-tag {
  color: #333;
  font-size: 28rpx;
}

.add-tag {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #FFA500;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

/* Case section */
.case-section {
  background: #fff;
  margin: 24rpx 0;
}

.media-list {
  padding: 24rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.media-item {
  aspect-ratio: 1;
  background: #f8f8f8;
  border-radius: 8rpx;
  overflow: hidden;
}

.media-item image,
.media-item video {
  width: 100%;
  height: 100%;
}

.media-list .add-tag {
  aspect-ratio: 1;
  background: #f8f8f8;
  border: 2rpx dashed #FFA500;
  color: #FFA500;
  font-size: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Save button */
.save-btn {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  right: 30rpx;
  width: calc(100% - 60rpx);
  background: #FFA500;
  color: #fff;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
}

/* Input popup */
.input-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.input-box {
  width: 80%;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  z-index: 10000;
}

.tag-input {
  height: 88rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 24rpx;
  margin: 32rpx 0;
  color: #333;
}

.input-actions {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.cancel {
  background: #f0f0f0;
  color: #666;
}

.action-btn.confirm {
  background: #FFA500;
  color: #fff;
}

/* Service area */
.service-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
}

.service-area text {
  color: #333;
}

.select-area-btn {
  background-color: #FFA500;
  color: #fff;
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
}
</style>
