<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { px2rem } from '@/utils/utils'
  export default {
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ],
        lineWidth: [
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 }
        ],
        // 当前是添加还是减少
        add: true,
        end: false
      }
    },
    methods: {},
    mounted() {
      this.task = setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const mask = this.$refs.mask[index]
          const line = this.$refs.line[index]
          let maskWidth = this.maskWidth[index]
          let lineWidth = this.lineWidth[index]
          if (index === 0) {
            // 当前如果是可以添加的，并且mask长度小于16
            // 才进行mask++ line--
            if (this.add && maskWidth.value < 16) {
              maskWidth.value++
              lineWidth.value--
              
            } else if (!this.add && lineWidth.value < 16) {
              // 否则就是 当前不能添加，并且line的值 <  16 
              // 就可以继续添加line 和  mask就不能
              maskWidth.value--
              lineWidth.value++
            }
          } else {
            // 如果当前的index不是第一个情况下，
            // 判断当前是否是可以添加的并且满足条件mask<16的
            // 情况下  才可以添加
            if (this.add && maskWidth.value < 16) {
              // 获取前一个mask的width
              let preMaskWidth = this.maskWidth[index - 1]
              // 线条的宽度
              // 判断他的value是不是 >=8 如果是  mask就可以继续加

              if (preMaskWidth.value >= 8) {
                maskWidth.value++
                lineWidth.value--
              }
            } else if (!this.add && lineWidth.value < 16) {
              // 相反的话就继续
              // mask--
              // line ++
              let preLineWidth = this.lineWidth[index - 1]
              if (preLineWidth.value >= 8) {
                maskWidth.value--
                lineWidth.value++
              }
            }
          }
          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
          // 如果当前的index以及是mask
          if (index === this.maskWidth.length - 1) {
            if (this.add) {
              if (maskWidth.value === 16) {
                this.end = true
              }
            } else {
              if (maskWidth.value === 0) {
                this.end = true
              }
            }
          }
          if (this.end) {
            this.add = !this.add
            this.end = false
          }
        })
      }, 20)
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-loading {
    position: relative;
    z-index: 500;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      .ebook-loading-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: px2rem(7) 0;
        box-sizing: border-box;
        .ebook-loading-line-wrapper {
          flex: 1;
          padding: 0 px2rem(7);
          box-sizing: border-box;
          @include left;
          .ebook-loading-mask {
            flex: 0 0 0;
            width: 0;
            height: px2rem(1.5);
          }
          .ebook-loading-line {
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
        }
      }
      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }
</style>
