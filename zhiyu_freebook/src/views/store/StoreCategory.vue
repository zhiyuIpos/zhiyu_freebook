<template>
  <div class="store-category">
    <shelf-title :title="shelfCategory.title"
                  :ifShowBack="true"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0" 
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
            v-if="isShowList">
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      {{$t('shelf.groupNone')}}
    </div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '@/components/shelf/ShelfTitle'
  import Scroll from '@/components/common/Scroll'
  import ShelfFooter from '@/components/shelf/ShelfFooter'
  import Toast from '@/components/common/Toast'
  import ShelfList from '@/components/shelf/ShelfList'
  import {storeShelfMixin} from '@/utils/mixin'
  import Epub from 'epubjs'
  global.ePub = Epub
  export default {
    mixins:[storeShelfMixin],
    components: {
      ShelfTitle,
      Scroll,
      ShelfList,
      ShelfFooter,
      Toast
    },
    computed: {
       isShowList(){
         return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
       }
    },
    data() {
      return {
        scrollBottom: 0,
      }
    },
    methods: {
      onScroll(offsetY) {
        if (offsetY > 0) {
          this.$refs.shelfTitle.showShadow()
        } else {
          this.$refs.shelfTitle.hideShadow()
        }
      }
    },
    mounted() {
      this.getCategoryList(this.$route.query.title)
      this.setCurrentType(2)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-category {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper{
      position: absolute;
      top:0;
      left:0;
      z-index: 101;
    }
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(14);
      color: #333;
    }
  }
</style>
