 <template>
<!--  <view class="footer">
    <view class="row">解释权归乐清市蜂点网络技术所有</view>
    <view class="row">Copyright © {{ year }} 有帮手 版权所有</view>
    <view class="row">浙江省温州市乐清市</view>
  </view> -->
  <view class="kefu">
    <button class="btn" disabled></button>
    <image src="@/static/images/kefufill.png" mode="aspectFill" class="pic" />
    <view class="line"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
const year = ref(new Date().getFullYear());
</script>

<style lang="scss">
.footer {
  padding: 50rpx 0;
  text-align: center;
  background: #f6f7f8;
  border-top: 1px solid #ffcf10;
  color: #4c4d4e;
  font-size: 30rpx;
  line-height: 1.8em;
}
.kefu {
  width: 100rpx;
  height: 100rpx;
  background: #ffcf10;
  position: fixed;
  z-index: 10;
  bottom: 100rpx;
  right: 60rpx;
  border-radius: 50%;
  box-shadow: 0 0 30rpx rgba(226, 190, 77, 0.8);
  .btn {
    position: relative;
    z-index: 2;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .pic {
    width: 85%;
    height: 85%;
    margin: 5%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 1;
  }
}
.line {
  width: 100%;
  height: 100%;
  border: 3px solid #ffcf10;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  animation: emit 1s infinite;
}
@keyframes emit {
  0% {}
  100% {
    border-width: 2px;
    opacity: 0;
    transform: scale(1.5);
  }
}
</style> 