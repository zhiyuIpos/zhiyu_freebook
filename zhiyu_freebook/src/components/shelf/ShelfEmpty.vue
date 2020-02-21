<template>
  <div class="book-shelf-empty-wrapper" ref="emptyView">
    <div class="empty-img-wrapper">
      <img class="empty-img" :src="img">
    </div>
    <div class="empty-text-wrapper">
      <div class="empty-text">
        您的书架空空如也 <br>
        扫描上方二维码可添加好友
      </div>
    </div>
    <div class="empty-btn-wrapper">
      <div class="empty-btn" @click="gotoBookStore">{{$t('shelf.find')}}</div>
    </div>
  </div>
</template>
<script>
  import { realPx } from '@/utils/utils'

  export default {
    data() {
      return {
        img: require('@/assets/images/icon.jpg')
      }
    },
    methods: {
      gotoBookStore() {
        this.$router.push('/store/home')
      },
      gotoStudy() {
        window.location.href = 'https://coding.imooc.com/class/285.html'
      }
    },
    mounted() {
      this.$refs.emptyView.style.height = window.innerHeight - realPx(42) + 'px'
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf-empty-wrapper {
    width: 100%;
    position: absolute;
    top:0;
    left:0;
      z-index: 200;
      height: 100%;
      background: white;
    .empty-img-wrapper {
      width: 100%;
      margin-top: px2rem(50);
      text-align: center;
      
      .empty-img {
        width: px2rem(200);
        height: px2rem(200);
      }
    }
    .empty-text-wrapper {
      width: 100%;
      margin-top: px2rem(10);
      text-align: center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .empty-text {
        font-size: px2rem(16);
        color: #333;
        line-height: px2rem(30);
      }
    }
    .empty-btn-wrapper {
      width: 100%;
      padding: px2rem(30) px2rem(15) px2rem(15) px2rem(15);
      box-sizing: border-box;
      @include center;
      .empty-btn {
        width: 100%;
        font-size: px2rem(14);
        font-weight: bold;
        color: white;
        padding: px2rem(15) 0;
        text-align: center;
        border-radius: px2rem(10);
        background: $color-blue;
        &:first-child {
          margin-right: px2rem(7.5);
          background:cadetblue;
        }
        &:last-child {
          margin-left: px2rem(7.5);
        }
        &:active {
          background: $color-blue-transparent;
        }
      }
    }
  }
</style>
