<template>
   <div>
    <div class="search-bar" 
         :class="{'hide-title' :!titleVisible,
         'hide-shadow':!shadowVisible}"
         >
     <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper"
               @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
     </transition>
     <!-- 返回按钮 -->
        <div class="title-icon-back-wrapper" 
             :class="{'hide-title': !titleVisible}"
             @click="back">
          <span class="icon-back icon"></span>
        </div>
      <!-- 搜索 -->
      <div class="search-bar-input-wrapper" 
           :class="{'hide-title': !titleVisible}">
           <!-- 虚拟站位用 -->
           <div class="search-bar-blank"
                :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon">
          </span>
          <input type="text" 
                     class="input"
                     :placeholder="$t('home.hint')"
                     v-model="searchText"
                     @click="showHotSearch"
                     @keyup.13.exact="search">
                     <!-- keyup.13.exact点击回车并且只能点击回车触发 -->
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible"
                     ref="hotSearch"></hot-search-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import HotSearchList from '@/components/home/HotSearchList'
  import { realPx } from '@/utils/utils'
  import {storeHomeMixin} from '../../utils/mixin'
  export default {
    mixins:[storeHomeMixin],
    components: {
      HotSearchList
    },
    props: {
      random:Number,
      ifShowSearchPage: {
        type: Boolean,
        default: false
      },
      ifShowHotSearch: {
        type: Boolean,
        default: true
      },
      bookListOffsetY: Number
    },
    data(){
      return{
        shadowVisible:false,
        searchText: null,
        titleVisible : true,
        hotSearchVisible:false
      }
    },
    methods: {
      back(){
        if(this.offsetY > 0){
          this.showShadow()
        }else{
          this.hideShadow()
        }
        if(this.hotSearchVisible){
          this.hideHotSearch()
        }else{
          this.$router.push('/store/shelf')
        }
        this.hideHotSearch()
      },
      setKeyword(keyword) {
        this.searchText = keyword
        this.searchList.historySearch.push(keyword)
      },
      search() {
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
      },
      showHotSearch(){
          this.hideShadow()
          this.hideTitle()
          this.hotSearchVisible =true
          // 在dom更新之后，在执行
          this.$nextTick(()=>{
            this.$refs.hotSearch.reset()
          })
      },
      hideHotSearch() {
        this.hotSearchVisible =false
        if(this.offsetY > 0){
          this.hideTitle()
          this.showShadow()
        }else{
          this.showTitle()
          this.hideShadow()
        }
      },
      showShadow() {
        this.shadowVisible = true
      },
      hideShadow() {
        this.shadowVisible = false
      },
      showSearchPageAndHotSearch() {
        this.showSearchPage()
        this.hideShadow()
        this.$emit('update:ifShowHotSearch', true)
        this.$nextTick(() => {
          this.initHotSearch()
        })
      },
      hideSearchPage() {
        this.$emit('update:ifShowSearchPage', false)
        this.shadowVisible = true
      },
      showSearchPage() {
        this.$emit('update:ifShowSearchPage', true)
      },
      showFlapCard() {
        this.setFlapCardVisible(true)
      },
      handleScroll(e) {
        const target = e.target
        if (target) {
          if (target.scrollTop > 0) {
            this.ifHideShadow = false
          } else {
            this.ifHideShadow = true
          }
        }
      },
      initHotSearch() {
        if (this.$refs.searchMaskWrapper) {
          this.$refs.searchMaskWrapper.style.height = window.innerHeight - realPx(52) + 'px'
          this.$refs.searchMaskWrapper.addEventListener('scroll', this.handleScroll)
          this.$refs.searchMaskWrapper.scrollTo(0, 0)
        }
      },
      hideTitle(){
        this.titleVisible = false
      },
      showTitle(){
        this.titleVisible = true
      }
    },
    watch:{
      offsetY(offsetY){
        if(offsetY > 0){
            this.hideTitle()
            this.showShadow()
        }else{
            this.showTitle()
            this.hideShadow()
        }
      },
      hotSearchOffsetY(offsetY){
        if(offsetY >0){
          this.showShadow()
        }else{
          this.hideShadow()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .search-bar{
    position:relative;
    width: 100%;
    height: px2rem(94);
    z-index: 151;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.1);
    &.hide-title{
      height: px2rem(52);
    }
    &.hide-shadow{
      box-shadow: none;
    }
    .title-icon-back-wrapper{
      position: absolute;
      left: px2rem(15);
      top:0;
      height: px2rem(42);
      z-index: 200;
      @include center;
      transition:all $animationTime $animationType;
      &.hide-title{
        height: px2rem(52);
      }
    }
    .search-bar-title-wrapper{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height:px2rem(42);
      .title-text-wrapper{
        width: 100%;
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper{
        position: absolute;
        right:px2rem(15);
        top:0;
        height:px2rem(42);
        @include center;
      }
    }
    .search-bar-input-wrapper{
      position: absolute;
      left: 0;
      top:px2rem(42);
      width: 100%;
      height:px2rem(52);
      padding:px2rem(10);
      display: flex;
      box-sizing: border-box;
      transition:top $animationTime $animationType;
      &.hide-title{
        top: 0;
      }
      .search-bar-blank{
        flex: 0 0 0;
        width: 0;
        transition:all $animationTime $animationType;
        &.hide-title{
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-bar-input{
        flex: 1;
        border-radius: px2rem(20);
        padding:px2rem(5) px2rem(15);
        box-sizing: border-box;
        width: 100%;
        background:#f4f4f4;
        border:px2rem(1) solide #eee;
        @include left;
        icon-search{
          color: #999;
        }
        .input{
          width: 100%;
          height: px2rem(22);
          border:none;
          background:transparent;
          margin-left: px2rem(10);
          font-size: px2rem(12);
          color: #666;
          &:focus{
          outline:none;
          }
          &::-webkit-input-placeholder{
            color: #ccc;
          }
        }
      }
    }
  }
  // .search-bar-wrapper {
  //   .title-search-wrapper {
  //     position: relative;
  //     z-index: 110;
  //     width: 100%;
  //     height: px2rem(94);
  //     background: white;
  //     box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  //     &.show-search {
  //       height: px2rem(52);
  //     }
  //     &.hide-shadow {
  //       box-shadow: none;
  //     }
  //     .title-search-page-wrapper {
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       z-index: 105;
  //       width: 100%;
  //       height: px2rem(42);
  //       @include center;
  //       .title-text {
  //         font-weight: bold;
  //       }
  //       .icon-shake-wrapper {
  //         position: absolute;
  //         right: 0;
  //         top: 0;
  //         z-index: 110;
  //         padding-right: px2rem(10);
  //         height: 100%;
  //         @include center;
  //       }
  //     }
  //     .icon-back-wrapper {
  //       position: absolute;
  //       left: px2rem(10);
  //       top: 0;
  //       z-index: 110;
  //       height: px2rem(42);
  //       @include center;
  //       transition: all $homeAnimationTime linear;
  //       &.show-search {
  //         height: px2rem(52);
  //       }
  //     }
  //     .search-wrapper {
  //       position: absolute;
  //       top: px2rem(42);
  //       left: 0;
  //       z-index: 100;
  //       display: flex;
  //       padding: px2rem(10);
  //       width: 100%;
  //       box-sizing: border-box;
  //       transition: all $homeAnimationTime linear;
  //       &.show-search {
  //         top: 0;
  //       }
  //       .search-back-wrapper {
  //         flex: 0;
  //         width: 0;
  //         @include center;
  //         transition: all $homeAnimationTime linear;
  //         visibility: hidden;
  //         &.show-search {
  //           margin-right: px2rem(10);
  //           flex: 0 0 px2rem(20);
  //           width: px2rem(20);
  //         }
  //         .icon-back {
  //           font-size: 0;
  //           &.show-search {
  //             font-size: px2rem(20);
  //           }
  //         }
  //       }
  //       .search-bg {
  //         flex: 1;
  //         background: #f4f4f4;
  //         border-radius: px2rem(20);
  //         border: px2rem(1) solid #eee;
  //         box-sizing: border-box;
  //         padding: px2rem(5) px2rem(15);
  //         transition: all $homeAnimationTime linear;
  //         @include left;
  //         .icon-search {
  //           font-size: px2rem(16);
  //           color: #999;
  //         }
  //         .search {
  //           color: #666;
  //           width: 100%;
  //           height: px2rem(22);
  //           background: transparent;
  //           font-size: px2rem(12);
  //           margin-left: px2rem(10);
  //           border: none;
  //           &:focus {
  //             outline: none;
  //           }
  //           &::-webkit-input-placeholder {
  //             color: #ccc;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   .hot-search-wrapper {
  //     width: 100%;
  //     height: 100%;
  //     background: white;
  //     overflow-x: hidden;
  //     overflow-y: scroll;
  //     -webkit-overflow-scrolling: touch;
  //     &::-webkit-scrollbar {
  //       display: none;
  //     }
  //     .line {
  //       width: 100%;
  //       height: 0;
  //       border-top: px2rem(1) solid #eee;
  //       margin: px2rem(10) 0;
  //     }
  //   }
  // }
</style>
