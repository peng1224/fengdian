 <template>
  <navigator :url="'/pages/NewsDetail/NewsDetail?id=' + item._id" class="nsitem">
    <view class="pic">
      <image class="img" :src="item.picurl" mode="aspectFill" />
    </view>
    <view class="text">
      <view class="title">{{ item.title }}</view>
      <view class="info">
        <view class="block">
          <uni-icons type="calendar" size="18" class="icon-class" />
          <text>{{ item.publish_date }}</text>
        </view>
        <view class="block">
          <uni-icons type="eye" size="18" class="icon-class" />
          <text>{{ item.view_count_display }}</text>
        </view>
        <view class="block">
          <uni-icons type="person" size="18" class="icon-class" />
          <text>{{ item.author }}</text>
        </view>
      </view>
    </view>
  </navigator>
</template>

<script setup>
// 接收item属性
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style lang="scss" scoped>
.nsitem {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
  margin-bottom: 24rpx;
  overflow: hidden;
  .pic {
    width: 220rpx;
    height: 150rpx;
    flex-shrink: 0;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
  .text {
    width: 440rpx;
    height: 150rpx;
    text-align: justify;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 0 24rpx;
    box-sizing: border-box;
    .title {
      line-height: 1.4em;
      color: var(--globalcolor);
      font-size: 32rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .info {
      display: flex;
      justify-content: flex-start;
      gap: 32rpx;
      font-size: 28rpx;
      color: var(--descColor);
      .block {
        display: flex;
        align-items: center;
      }
      .icon-class {
        color: var(--descColor);
        margin-right: 6rpx;
      }
    }
  }
}
</style> 