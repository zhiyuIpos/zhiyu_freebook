<template>
  <transition name="fade">
    <div class="shelf-title" 
        v-show="shelfTitleVisible"
        :class="{'hide-shadow':ifHideShadow}">
      <!-- 头部 -->
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-sub-title-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <!-- 头部按钮 清除缓存-->
      <div class="shelf-title-btn-wrapper shelf-title-left"
           v-if="!ifShowBack">
        <span class="shelf-title-btn-text" @click="clickCache"> {{$t('shelf.clearCache')}}</span>
      </div>
      <!-- 头部按钮 编辑-->
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t('shelf.cancel'):$t('shelf.edit') }}</span>
      </div>

      <div class="shelf-title-btn-wrapper shelf-title-left"
           v-if="ifShowBack">
        <span class="icon-back" @click="back"></span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin'
import { clearLocalStorage } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage'
  export default {
    mixins:[storeShelfMixin],
    props:{
      title:String,
      ifShowBack:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      // 选泽图书
      selectedText() {
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length:0
        return selectedNumber <= 0 ? this.$t('shelf.selectBook'):
        (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook')
        .replace('$1',selectedNumber) : this.$t('shelf.haveSelectedBooks')
        .replace('$1',selectedNumber))
      }
    },
    data(){
      return{
        ifHideShadow:true
      }
    },
    watch:{
      offsetY(offsetY){
        if(offsetY > 0){
          this.ifHideShadow = false
        }else{
          this.ifHideShadow = true
        }
      }
    },
    methods: {
      back(){

        this.$router.go(-1)
        this.setIsEditMode(false)
      },
      onEditClick(){
        if(!this.isEditMode){
          this.setShelfSelected([])
          this.shelfList.forEach(item=>{
            item.selected=false
            if(item.itemList){
              item.itemList.forEach(subItem=>{
                subItem.selected= false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },
      clickCache(){
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()
        this.simpleToast(this.$t('shelf.clearCacheSuccess'))
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 110;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-sub-title-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      z-index: 115;
      padding-right: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back{
        font-size: px2rem(20);
        color: #666;
      }
      &.shelf-title-left{
        left:0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right{
        right:0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
