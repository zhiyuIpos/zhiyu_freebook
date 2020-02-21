<template>
  <div class="ebook-footer">
    <!-- 百分比 -->
    <span class="ebook-footer-text">{{this.paginate}}</span>
    <!-- 页数，epub还没有具体的分页实现，有可能会出现错乱几页的情况 -->
    <!-- <span class="ebook-footer-text">{{this.progress + '%'}}</span> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin]
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    @include right;
    .ebook-footer-text {
      font-size: px2rem(12);
      color: #6d7178;
    }
  }
</style>
