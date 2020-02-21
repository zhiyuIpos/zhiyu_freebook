<template>
 <div class="ebook" ref="ebook">
     <ebook-reader></ebook-reader>
     <ebook-title></ebook-title>
     <ebook-menu></ebook-menu>
     <ebook-bookmark></ebook-bookmark>
     <ebook-header></ebook-header>
     <ebook-footer></ebook-footer>
 </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import {getReadTime,saveReadTime} from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
export default {
    mixins:[ebookMixin],
    components :{
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    watch:{
        offsetY(v){
            // 如果当前menu是不显示的并且书籍加载完成 才可以执行move重置等操作
            if(!this.menuVisible && this.bookAvailable){
                if(v>0){
                this.move(v)
                }else if(v==0){
                    this.restore()
                }
            }
        }
    },
    // 计算阅读时间
    methods:{
        restore(){
            this.$refs.ebook.style.top=0;
            this.$refs.ebook.style.transition = 'all .2s linear'
            setTimeout(()=>{
                this.$refs.ebook.style.transition = ''
            },200)
        },  
        move(v){
            this.$refs.ebook.style.top= v+ 'px'
        },
        startLoopReadTime(){
            let readTime = getReadTime(this.fileName)
            // console.log("readTime" , readTime)
            if(!readTime){
                readTime = 0
            }       
            this.task = setInterval(()=>{
                readTime++ //单位秒
                // console.log(readTime)
                if(readTime % 30 === 0){
                    saveReadTime(this.fileName , readTime)
                }
            },1000)
        }
    },
    mounted(){
        this.startLoopReadTime()
    },
    // 销毁之前 
    beforeDestroy(){
        if(this.task){
            //终止定时任务
            clearInterval(this.task)
        }
    }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.ebook{
    position:absolute;
    left : 0;
    top:0;
    width:100%;
    height:100%;
}
</style>