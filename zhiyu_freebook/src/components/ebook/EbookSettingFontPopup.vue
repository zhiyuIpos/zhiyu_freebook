<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-if="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hideFontFamilySetting">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) in fontFamily" :key="index"
             @click="setFontFamily(item.font)">
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '@/utils/mixin'
  import { saveFontFamily ,setLocalStorage} from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    data (){
      return{
        fontFamilyList :[]
      }
    },
    mounted(){
      setLocalStorage(this.fileName,  this.defaultFontFamily)
    },
    methods: {
      setFontFamily(font){
        // 设置默认的字体为选中的字体
        this.setDefaultFontFamily(font)
        // 保存字体
        saveFontFamily(this.fileName , font)//调用utils里面的localstoage里面的方法
        // 判断当前选择的是否是默认的，如果是默认的，就直接设置一个默认字体
        // 否则就是选中当前的字体设置就行
        if(font === 'Default'){
          this.currentBook.rendition.themes.font('Times New Roman')
        }else{
        this.currentBook.rendition.themes.font(font)
        }
      },
      isSelected(item) {
        return this.defaultFontFamily === item.font
      },
      hideFontFamilySetting(){
        this.setFontFamilyVisible(false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1350;
    width: 100%;
    background:white;
    font-size: 0;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title {
      position: relative;
      text-align: center;
      padding: px2rem(15);
      border-bottom: px2rem(1) solid #b8b9bb;
      box-sizing: border-box;
      @include center;
      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
      .ebook-popup-title-icon {
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        @include center;
        .icon-down2 {
          font-size: px2rem(16);
          font-weight: bold;
        }
      }
    }
    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          .icon-check {
            font-size: px2rem(14);
            font-weight: bold;
            color: #346cb9;
          }
        }
      }
    }
  }
</style>
