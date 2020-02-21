<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">
        {{text}}
      </div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <book-mark :width="15" :height="35" :color="color" ref="bookmark"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BookMark from '@/components/common/Bookmark'
  import { realPx } from '@/utils/utils'
  import { ebookMixin } from '../../utils/mixin'
  import { saveBookmark, getBookmark } from '@/utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin],
    components: {
      BookMark
    },
    computed: {
      // 未到达临界状态
      height() {
        return realPx(35)
      },
      // 零界状态
      threshold() {
        return realPx(55)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          // 算法 
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`,
          top: 0
        }
      }
    },
    // 这里也要监听offsetY
    watch: {
      offsetY(v) {
        if (!this.bookAvailable || this.menuVisible || 
        this.settingVisible >= 0) {
          return
        }
        //未到达临界状态2
        if (v >= this.height && v < this.threshold) {
          //this.setBookmark = false
          this.beforeThreshold(v)
          // 达到临界点的时候3
        } else if (v >= this.threshold) {
          //this.setBookmark = true
          this.afterThreshold(v)
          // 状态1 文本和书签的颜色做一个定位
        } else if (v > 0 && v < this.height) {
          this.beforeHeight()
          // 归位
        } else if (v === 0) {
          this.restore()
        }
      },
      isBookmark(isBookmark) {
        this.isFixed = isBookmark
        if (isBookmark) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data() {
      return {
        color: WHITE,
        text: '',
        // 是否添加蓝色定位
        isFixed: false
      }
    },
    methods: {
      // 状态1
      beforeHeight(){
          //判断是不是书签，若果是书签，就显示下拉删除书签
          if (this.isBookmark) {
            this.text = this.$t('book.pulldownDeleteMark')
            this.color = BLUE
            this.isFixed = true
          } else {
            // 如果不是，下拉就是添加书签
            this.text = this.$t('book.pulldownAddMark')
            this.color = WHITE
            this.isFixed = false
          }
      },
      // 状态2
      beforeThreshold(v){
        this.$refs.bookmark.style.top = `${-v}px`
          this.beforeHeight()
          if (this.$refs.iconDown.style.transform === 'rotate(180deg)') {
            this.$refs.iconDown.style.transform = 'rotate(0deg)'
          }
      },
      // 状态3
      afterThreshold(v){
         this.$refs.bookmark.style.top = `${-v}px`
         this.beforeHeight()
          if (this.$refs.iconDown.style.transform === 'rotate(0deg)' ||
            this.$refs.iconDown.style.transform === '') {
            this.$refs.iconDown.style.transform = 'rotate(180deg)'
          }
          if (!this.isBookmark) {
            this.text = this.$t('book.releaseAddMark')
            this.color = BLUE
             this.isFixed = true
          } else {
            this.text = this.$t('book.releaseDeleteMark')
            this.color = WHITE 
            this.isFixed = false 
          }
         
      },
      // 状态4
      restore(){
        // 书签归位
        // 图标归位
        setTimeout(()=>{
        this.$refs.iconDown.style.transform='rotate(0deg)'
        this.$refs.bookmark.style.top= `${-this.height}px`
        },200) 
        if(this.isFixed){
          this.setIsBookmark(true)
          this.addBookmark()
        }else{
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      addBookmark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          // 不存在就初始化
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        console.log("currentLocation",currentLocation)
        // 把!后面的内容替换成空
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
        // 把start里面的cfi的！前面的替换成空，并且把)也替换成空
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
        // 把end后面的cif的！前面的替换成空
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
        // 通过拼接前后的start和end
        // 然后通过getRange方法吧拼接的数据传递进去
        // 就可以获取到range对想，里面就有文本内容
        const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
        const cfi = currentLocation.start.cfi
        this.currentBook.getRange(cfiRange).then(range => {
          let text = range.toString()
          text = text.replace(/\s\s/g, '')
          this.bookmark.push({
            cfi,
            text
          })
          this.setIsBookmark(true)
          // 保存书签
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          // 保存 删除之后的
          saveBookmark(this.fileName, 
          this.bookmark.filter(item => item.cfi !== cfi))
        }
        this.setIsBookmark(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    background:#bbb;
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(10);
    }
  }
</style>
