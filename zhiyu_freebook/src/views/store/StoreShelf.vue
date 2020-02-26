<template>
  <div class="store-shelf">
    <shelf-title class="shelf-title"
                 :title="$t('shelf.title')"
                 ref="shelfTitle"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
                 :top="0"
                 :bottom='scrollBottom'
                 @onScroll="onScroll"
                 ref="scroll">
      <shelf-search ref="shelfSearch"></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
    import ShelfTitle from '@/components/shelf/ShelfTitle'
    import ShelfSearch from '@/components/shelf/ShelfSearch'
    import ShelfList from '@/components/shelf/ShelfList'
    import ShelfFooter from '@/components/shelf/ShelfFooter'
    import Scroll from '@/components/common/Scroll'
    import { storeShelfMixin} from '@/utils/mixin'
  export default {
    mixins:[storeShelfMixin],
    components: {
      ShelfTitle,
      ShelfSearch,
      ShelfList,
      ShelfFooter,
      Scroll
    },
    watch:{
      isEditMode(isEditMode){
        this.scrollBottom =  isEditMode?48 :0
        this.$nextTick(()=>{
          this.$refs.scroll.refresh()
        })
      }
    },
    data() {
      return {
        scrollBottom:0,
        shelfHaveBook:null
      }
    },
    methods: {
      onScroll(offsetY){
        this.setOffsetY(offsetY) 
      },
    },
    mounted() {
      this.getShelfList()
      this.setShelfCategory([]) 
      this.setCurrentType(1)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    z-index: 100;
    .shelf-title {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 110;
    }
    
  }
</style>
