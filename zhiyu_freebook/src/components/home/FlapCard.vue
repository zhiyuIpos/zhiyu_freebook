<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" 
    :class="{'animation': runFlapCardAnimation}"
    v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" 
                              :key="index" 
                              :style="{zIndex: item.zIndex}">
        <!-- 圆 -->
        <div class="flap-card-semi-circle">
          <div class="flap-card-semi-circle-left" :style="semiCricelStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle-right" :style="semiCricelStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper" v-show="runPointAnimation">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="(item, index) in pointList"
             :key="index"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <!--  v-lazy="data.cover" -->
          <img class="img" v-lazy="data ? data.cover:''">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data?data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="[showBookDetail(data),closeCover()]">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {storeHomeMixin} from '../../utils/mixin'
import { categoryText ,flapCardList} from '@/utils/store'
  export default {
    mixins:[storeHomeMixin],
    props: {
      data: Object
    },
    data() {
      return {
        pointList: [],
        flapCardList,
        front: 0,
        back: 1,
        intervalTime: 25,
        runPointAnimation: false,
        runFlapCardAnimation: false,
        runBookCardAnimation: false,
        ifShowBookCard: false,
        ifShowFlapCard: true,
        ifShowPoint: true
      }
    },
    watch:{
      flapCardVisible(v){
        if(v){
          this.startAnimation()
        }
      }
    },
    methods: {
      categoryText() {
        if(this.data){
          return categoryText(this.data.category, this)
        }else{
          return ''
        }
      },
      // 立即阅读之后关闭遮罩层
      closeCover(){
        this.close()
      },
      close() {
        // 重置一下
        this.stopAnimation()
        this.setFlapCardVisible(false)
        // 关闭之后，调用父元素的方法，触发父元素自定义事件
        this.$emit('close')
      },
      // 开始动画
      startAnimation() {
        this.runFlapCardAnimation = true
        this.timeout = setTimeout(() => {
          this.startFlapCardAnimation()
          this.startPointAnimation()
        }, 300)
        this.timeout2 = setTimeout(() => {
          this.stopAnimation()
          this.runBookCardAnimation= true
          // this.showBookCard()
        }, 2500)
      },
      showBookCard() {
        this.ifShowBookCard = true
        this.runBookCardAnimation = true
        this.ifShowFlapCard = false
        this.ifShowPoint = false
      },
      startPointAnimation() {
        this.runPointAnimation = true
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      startFlapCardAnimation() {
        this.prepare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.intervalTime)
      },
      prepare() {
        const backFlapCard = this.flapCardList[this.back]
        backFlapCard.rotateDegree = 180
        // 对默认的颜色进行变淡
        backFlapCard._g = backFlapCard.g - 5 * 9
        this.rotate(this.back,'back')
      },
      stopAnimation() {
        if(this.task)clearInterval(this.task)
        if(this.timeout2){
          clearTimeout(this.timeout2)
        }
        if(this.timeout){
          clearTimeout(this.timeout)
        }
        this.reset()
      },
      reset() {
        // 重置
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item,index)=>{
          item.zIndex = 100 - index
          item._g = item.g
          item.rotateDegree =0
          // 
          this.rotate(index,'front')
          this.rotate(index,'back')
        })
        this.runBookCardAnimation =false
        this.runFlapCardAnimation = false
        this.runPointAnimation = false
      },
      flapCardRotate() {
          const frontFlapCard = this.flapCardList[this.front]
          const backFlapCard = this.flapCardList[this.back]
          frontFlapCard.rotateDegree+=10
          frontFlapCard._g-=5
          backFlapCard.rotateDegree-=10
          // 临界值颜色再做变化
          if(backFlapCard.rotateDegree < 90){
            backFlapCard._g+=5
          }
          if(frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree ===90){
            backFlapCard.zIndex +=2
          }
          this.rotate(this.front,'front')
          this.rotate(this.back,'back')
          // 转动到180，和后面的到达零度的时候，就下一个
          if(frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree ===0){
            this.next()
          }
      },
      next(){
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        frontFlapCard._g  = frontFlapCard.g
        backFlapCard._g = backFlapCard.g
        this.rotate(this.front,'front')
        this.rotate(this.back,'back')
        this.front++
        this.back++
        let len =this.flapCardList.length
        if(this.front>=len){
          this.front = 0
        }
        if(this.back >=len){
          this.back = 0
        }
        this.flapCardList.forEach((item,index)=>{
          item.zIndex = 100 - ((index-this.front + len) % len)
        })
        this.prepare()
      },
      // 转动
      rotate(index, type) {
        const item = this.flapCardList[index]
        let dom
        if(type == 'front'){
          dom = this.$refs.right[index]
        }else{
          dom=this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
      },
      semiCricelStyle(item, direction) {
        return {
          backgroundColor: `rgb(${item.r} ,${item.g} ,${item.b})`,
          backgroundImage: direction === 'left' ? item.imgLeft : item.imgRight,
          backgroundSize: item.backgroundSize
        }
      }
    },
    created() {
      for (let i = 0; i < 18; i++) {
        this.pointList.push({})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .flap-card-wrapper {
    @include absCenter;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    color: white;
    @include center;
    .flap-card-bg{
      position: relative;
      width: px2rem(60);
      height: px2rem(60);
      background: white;
      border-radius: px2rem(5);
      transform: scale(0);
      opacity:0;
      &.animation {
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        70% {
          transform: scale(1.3);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        @include absCenter;
        z-index: 1500;
        margin: auto;
        width: px2rem(48);
        height: px2rem(48);
        .flap-card-semi-circle {
          width: 100%;
          height: 100%;
          display: flex;
          .flap-card-semi-circle-left {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-color: #ffc666;
            background-repeat: no-repeat;
            background-position: center right;
            border-radius: px2rem(24) 0 0 px2rem(24);
            transform-origin: right;
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-right {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center left;
            border-radius: 0 px2rem(24) px2rem(24) 0;
            transform-origin: left;
            backface-visibility: hidden;
          }
        }
      }
      .point-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2000;
        @include center;
        .point {
          @include absCenter;
          z-index: 3000;
          border-radius: 50%;
          transform: scale(0);
          &.animation {
            @for $i from 1 to length($moves) + 1 {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center;
      .icon-close {
        display: inline-block;
        width: px2rem(45);
        height: px2rem(45);
        font-size: px2rem(25);
        color: white;
        background: #333;
        border-radius: 50%;
        @include center;
      }
    }
  }
</style>
