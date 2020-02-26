<template>
  <div class="book-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" 
            @onScroll="onScroll" 
            ref="scroll"> 
      <div class="banner-wrapper">
        <div class="banner" :style="{backgroundImage:`url(${banner})`,height:'150px',margin:'0 10px'}"></div>
      </div>
      <!-- 猜你喜欢 -->
      <guess-you-like :data="guessYouLike" 
                      ref="guessYouLike"></guess-you-like>
      <!-- 热门推荐 -->
      <recommend class="recommend" 
                  :data="recommend" 
                  ref="recommend"></recommend>
      <!-- 精选 -->
      <featured class="featured" 
                :data="featured" 
                :titleText="$t('home.featured')" 
                :btnText="$t('home.seeAll')"
                ref="featured"></featured>
      <!--  -->
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <!-- 分类 -->
      <category class="category" :data="categories"></category>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import FlapCard from '@/components/home/FlapCard'
  import SearchBar from '@/components/home/SearchBar'
  import Category from '@/components/home/Category'
  import CategoryBook from '@/components/home/CategoryBook'
  import GuessYouLike from '@/components/home/GuessYouLike'
  import Recommend from '@/components/home/Recommend'
  import Scroll from '@/components/common/Scroll'
  import Featured from '@/components/home/Featured'
  import {storeHomeMixin} from '@/utils/mixin'
  import { home } from '@/api/store'
  export default {
    mixins:[storeHomeMixin],
    components: {
      FlapCard,
      SearchBar,
      Category,
      CategoryBook,
      GuessYouLike,
      Recommend,
      Scroll,
      Featured,
    },
    data() {
      return {
        scrollTop:94,
        random:null,
        banner:"",
        guessYouLike:null,
        recommend: null,
        featured: null,
        categories: null,
        categoryList: null,
        scrollTop : 94
      }
    },
    methods: {
      onScroll(offsetY){
        this.setOffsetY(offsetY)
        if(offsetY > 0){
          this.scrollTop = 54
        }else{
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      },
      home1(){
        home().then(response=>{
            if (response.status === 200 && response.data) {
                // 随机推荐书籍 
                const data= response.data
                const randomIndex = Math.floor(Math.random() * data.random.length)
                this.random = data.random[randomIndex]
                this.banner = data.banner
                this.guessYouLike = data.guessYouLike
                this.recommend = data.recommend
                this.featured = data.featured
                this.categoryList = data.categoryList
                this.categories = data.categories
                sessionStorage.setItem('home',JSON.stringify(data))
              }
        })   
      },
      home2(){
        let homeData = sessionStorage.getItem('home')
        homeData=JSON.parse(homeData)
        this.banner = homeData.banner
        this.guessYouLike = homeData.guessYouLike
        this.recommend = homeData.recommend
        this.featured = homeData.featured
        this.categoryList = homeData.categoryList
        this.categories = homeData.categories
        home().then(response=>{
            if (response.status === 200 && response.data) {
            // 随机推荐书籍
            const data= response.data
            const randomIndex = Math.floor(Math.random() * data.random.length)
            this.random = data.random[randomIndex]
            }
        })
      }
    },
    mounted() {
      let homeData = sessionStorage.getItem('home')
      if(!homeData){
        this.home1()
      }else{
        this.home2()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .book-home {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: px2rem(16);
    color: #666;
    .book-list-wrapper {
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
      .banner-wrapper {
        width: 100%;
        padding: px2rem(10);
        box-sizing: border-box;
        .banner {
          width: 100%;
          height: px2rem(150) !important;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
      .recommend {
        margin-top: px2rem(20);
      }
      .featured {
        margin-top: px2rem(20);
      }
      .category-list-wrapper {
        margin-top: px2rem(20);
      }
      .category {
        margin-top: px2rem(20);
      }
    }
  }
</style>
