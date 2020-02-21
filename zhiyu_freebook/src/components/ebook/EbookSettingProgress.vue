<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
          <!-- 阅读时间 -->
          <div class="read-time-wrapper">
            <div class="read-time-text">{{getReadTimeText()}}</div>
            <div class="icon-forward"></div>
          </div>
          <div class="progress-wrapper">
              <div class="progress-icon-wrapper"  @click="prevSection">
                <!-- 上一张 -->
                <span class="icon-back"></span>
              </div>
              <input type="range" class="progress"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress">
              <div class="progress-icon-wrapper" @click="nextSection">
                <!-- 上一张 -->
                <span class="icon-forward"></span>
              </div>
          </div>
          <!-- 文字 -->
          <div class="text-wrapper">
              <span class="progress-section-text">{{getSectionName}}</span>
              <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
          </div>
        </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '../../utils/mixin'
  import { saveProgress } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    data() {
      return {
        isProgressLoading: false
      }
    },
    methods: {
      prevSection() {   
        if(this.section>0 && this.bookAvailable){
          this.setSection(this.section -1).then(()=>{
              // 设置章节切换
              this.displaySection()
          })
        }
      },
      nextSection() {
        // spine是表示阅读进度 ，他的length表示有多少个章节，
        // 不能操作length - 1
        if(this.section < this.currentBook.spine.length - 1 && this.bookAvailable){
          this.setSection(this.section + 1).then(()=>{
            this.displaySection()
          })
        }
      },
      displaySection(){
        // 直接将对应的section传递过去
        const sectionInfo = this.currentBook.section(this.section)
          if(sectionInfo && sectionInfo.href){
          // this.currentBook.rendition.display(sectionInfo.href)
          // .then(()=>{
          //     this.refreshLocation() 
          // })
          // 调用display方法进行渲染
          this.display(sectionInfo.href)
          saveProgress()
        }
      },
      // // 获取当前的阅读进度 存放到mixins中
      // refreshLocation(){
      //   const currentLocation = this.currentBook.rendition.currentLocation()
      //   const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
      //   this.setProgress(Math.floor(progress * 100)) //变为整数
      //   // 保存当前阅读进度
      //   const startCfi = currentLocation.start.cfi
      //   saveLocation(this.fileName,startCfi)
      // },
      // 拖动过程 
      // 
      onProgressInput(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
      },
      // 拖动之后松手，改变进度条的颜色，并且
      // 显示对应的页数
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
          this.displayProgress()
        })
        saveProgress(this.fileName, progress)
      },
      // 更新拖动的左右两边的颜色，左边已读，右边未读
      updateProgressBg() {
        // 左右进度条的颜色改变，根据拖动的进度步长进行设置
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      }
    },
    updated() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
.setting-wrapper{
    position: absolute;
    bottom: px2rem(48);
    z-index: 151;
    left :0;
    width: 100%;
    height: px2rem(90);
    box-shadow:0 px2rem(-8) px2rem(8) rgba(0,0,0,.15);
    background:#fff;
    .setting-progress{
        position:relative;
        width:100%;
        height:100%;
        .read-time-wrapper{
          position: absolute;
          left :0;
          top:0;
          width: 100%;
          height:px2rem(40);
          font-size: px2rem(12);
          @include center;
        }
        .progress-wrapper{
            width:100%;
            height:100%;
            @include center;
            padding:0 px2rem(15);
            box-sizing:border-box;
            .progress-icon-wrapper{
              font-size: px2rem(20);
            }
            .progress{
                width:100%;
                // 覆盖默认样式
                -webkit-appearance:none;
                height: px2rem(2);
                // 背景设置为两种
                // background:-webkit-linear-gradient(#999,#000) no-repeat, #ddd;
                // background-size: 0 100% !important;
                margin:0 px2rem(10);
                &:focus{
                    outline:none;
                }
                &::-webkit-slider-thumb{
                    -webkit-appearance: none;
                    height:px2rem(20);
                    width:px2rem(20);
                    border-radius:50%;
                    background:white;
                    box-shadow:0 4px 4px 0 rgba(0,0,0,.15);
                    border:px2rem(1) solid #ddd;
                }
            }
        }
        .text-wrapper{
            position:absolute;
            left:0;
            bottom:0;
            width:100%;
            bottom: px2rem(10);
            color:#333;
            font-size: px2rem(12);
            @include center;
            padding:0 px2rem(15);
            box-sizing: border-box;
            .progress-section-text{
                @include ellipsis;
            }
        }
    }
}
</style>
