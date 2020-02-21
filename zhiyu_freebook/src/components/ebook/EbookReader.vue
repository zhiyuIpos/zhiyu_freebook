<template>
 <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" 
    @click="onMaskClick"
    @touchmove="move" 
    @touchend="moveEnd"
    @mousedown.left="onMouseEnter"
    @mousemove.left="onMouseMove"
    @mouseup="onMouseEnd"></div>  
    <!--   点击鼠标左键触发mousedown.left    -->
 </div>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import {getFontFamily,
        saveFontFamily,
        saveFontSize,
        getFontSize,
        saveTheme,
        getTheme,
        getLocation
} from '../../utils/localStorage'
import Epub from 'epubjs'
import { flatten } from '../../utils/book'
import { getLocalForage } from '../../utils/localForage'
global.ePub = Epub
export default {
    mixins:[ebookMixin],
    methods:{
        // 鼠标进入
        // 鼠标进入后移动
        // 鼠标从移动状态松手
        // 鼠标还原状态
        onMouseEnd(e){
            // 获取鼠标当前点击的位置
            if(this.mouseState == 2){
                this.setOffsetY(0)
                this.firstOffsetY = null
                this.mouseState = 3
            }else{
                this.mouseState  =4
            }
            // 如果当前的时间减去触碰的时间，小于200 就设置为4 还原状态
            const time = e.timeStamp - this.mouseStartTime
            if(time < 200){
                this.mouseState= 4
            }
            e.stopPropagation()
            e.preventDefault()
        },
        onMouseMove(e){
            if(this.mouseState == 1){
                this.mouseState = 2
            }else if(this.mouseState == 2){
                let offsetY = 0
                if(this.firstOffsetY){
                    offsetY=e.clientY - this.firstOffsetY
                    this.setOffsetY(offsetY)
                }else{
                    this.firstOffsetY = e.clientY
                }
            }
            e.stopPropagation()
            e.preventDefault()
        },
        onMouseEnter(e){
            this.mouseState = 1
            // 触碰时间
            this.mouseStartTime = e.timeStamp
            e.stopPropagation()
            e.preventDefault()
        },
        //下拉
        move(e){
            let offsetY= 0
            if(this.firstOffsetY){
                offsetY=e.changedTouches[0].clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            }else{
                this.firstOffsetY = e.changedTouches[0].clientY
            }
            // 下拉必须要加这两个去掉默认事件
            e.preventDefault();
            e.stopPropagation()
        },
        moveEnd(e){
            // 重置偏移量
            this.setOffsetY(0)
            this.firstOffsetY = null
        },
        // 蒙版上 点击,获取e.offsetX的值，判断是上一页还是现实titlemune
        // 还是下一页
        onMaskClick(e){
            //如果是状态 2 和 状态3 就执行
            // 因为状态2 表示move 状态3 表示end
            if(this.mouseState && this.mouseState == 2 || this.mouseState ==3){
                return  
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if(offsetX>0 && offsetX< width * 0.3){
                this.prevPage()
            }else if(offsetX > 0 && offsetX > width * 0.7){
                this.nextPage()
            }else{
                this.toggleTitleAndMenu()
            }
        },
        // 上一页
        prevPage(){
            // 判断rendition是否存在，存在就调用它自己的prev方法，然后，重新刷新
            if(this.rendition){
                this.rendition.prev().then(()=>{
                    this.refreshLocation()
                })
                // 翻页的时候隐藏title和menu
                this.hideTitleAndMenu()
            }
        },
        // 下一页
        nextPage(){
            if(this.rendition){
                this.rendition.next().then(()=>{
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        toggleTitleAndMenu(){
            // 如果title和menu是显示的，就表示他的子组件是隐藏的
            if(this.menuVisible){
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
            this.setMenuVisible(!this.menuVisible)
        },
        initFontSize(){
            // 获取缓存中的数据
            let fontSize = getFontSize(this.fileName)
            if(!fontSize){
                saveFontSize(this.fileName,this.defaultFontSize)
            }else{
                // 如果font存在，就设置字体为当前的字体
                this.rendition.themes.fontSize(fontSize)
                // 并且设置选中面板为当前的字体名字
                this.setDefaultFontSize(fontSize)
            }
        },
        initFontFamily(){
            let font = getFontFamily(this.fileName)
            if(!font){
                // 保存到本地
                saveFontFamily(this.fileName,this.defaultFontFamily)
            }else{
                // 如果font存在，就设置字体为当前的字体
                this.rendition.themes.font(font)
                // 并且设置选中面板为当前的字体名字
                this.setDefaultFontFamily(font)
            }
        },
        initTheme(){
            let defaultTheme = getTheme(this.fileName)
            if(!defaultTheme){
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName , defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme =>{
                this.rendition.themes.register(theme.name , theme.style)
            }) 
            // 选择默认样式
            this.rendition.themes.select(defaultTheme)
        },
        // 渲染电子书
        initRendition(){
            // renderTo方法就是渲染电子书
            this.rendition = this.book.renderTo('read',{
                width: window.innerWidth,
                height: window.innerHeight,
                method : 'default', //微信兼容 
                // 可修改为flow : "scrolled"
                // 在微信端不支持，火狐浏览器不支持
                // 如果使用这个，就是上下滚动切换，需要把组件
                // ebook-header 和 ebook-footer 
                // 和 上边的ebook-reader-mask这个div去掉
            })
            // 如果有就直接进行展示
            const location = getLocation(this.fileName)
            // display用于展示
            this.display(location,()=>{

                // 开始使用redition的on方法，实现电子书的左滑右滑动，touchstar touchmove
            // this.rendition.display().then(()=>{
            // 设置字号
            this.initFontSize()
            // 设置字体
            this.initFontFamily()
            // 主题
            this.initTheme()
            // 动态添加css
            this.initGlobalStyle()
            // 
            // this.refreshLocation()
            //})
            })
            // 加载字体，因为epubjs是iframe，所以需要把阅读器这个dom传入到
            // 注入到里面，
            this.rendition.hooks.content.register(contents =>{
               //引入style文件就可以了
               Promise.all([
                contents.addStylesheet(`${process.env.VUE_APP_EPUB_URL}/fonts/daysOne.css`),
                contents.addStylesheet(`${process.env.VUE_APP_EPUB_URL}/fonts/cabin.css`),
                contents.addStylesheet(`${process.env.VUE_APP_EPUB_URL}/fonts/montserrat.css`),
                contents.addStylesheet(`${process.env.VUE_APP_EPUB_URL}/fonts/tangerine.css`)
               ]).then(()=>{
                   console.log("字体加载完毕...")
               })
            })
        },
        // 解析电子书 ,获取封面 链接 ，目录
        parseBook(){
            // 作者和书名 图片 
            // load 表示电子书正在加载
            this.book.loaded.cover.then(cover=>{
                this.book.archive.createUrl(cover)
                .then(url =>{
                    // 把封面图片连接存入到local
                    this.setCover(url)
                })
            })
            // title部分的值
            this.book.loaded.metadata.then(metadata=>{
                this.setMetadata(metadata)  
            })
            // 目录
            this.book.loaded.navigation.then(nav=>{
                const navItem = flatten(nav.toc)
                function find(item,level =0){
                    // 判断有几级目录
                    // 如果find之后parent存在，就继续调用，find
                    //继续查找，
                    return !item.parent ? level:
                    find(navItem.filter(parentItem =>
                    parentItem.id === item.parent)[0],++level)
                }
                navItem.forEach(item=>{
                    item.level = find(item)
                })
                // 保存到local中
                this.setNavigation(navItem)
            })
        },
        initEpub(url){
            // 渲染电子书
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            // 渲染初始化过程
            this.initRendition()
            // 手势
            //this.initGesture()
            // 加载字体 合并到 initRendition方法中了

            // 解析电子书，提取对应的书籍信息
            this.parseBook()

            // 分页（ready在book书籍解锁的时候，就执行后面的方法）
            this.book.ready.then(() => {
                // 可通过epubcfi来定位
             this.setCurrentBook(this.book)
            // 750字一页 不精确 （传入一页显示的多少字数）
            return this.book.locations
            .generate(750 * (window.innerWidth / 375) 
            * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                // pageList初始化
                this.navigation.forEach(nav=>{
                    nav.pageList =[]
                })
                locations.forEach(item =>{
                    const loc = item.match(/\[(.*)\]!/)[1]
                    // 遍历目录 找到对应的目录
                    this.navigation.forEach(nav=>{
                        if(nav.href){
                            const href = nav.href.match(/^(.*)\.html$/)
                            if(href){   
                                if(href[1] === loc){
                                    nav.pageList.push(item)
                                }
                            }
                        }
                    })
                    // 初始页数
                    let currentPage = 1
                    this.navigation.forEach((nav,index)=>{
                        if(index === 0){
                            nav.page = 1
                        }else {
                            nav.page= currentPage
                        }
                        currentPage += nav.pageList.length + 1
                    })
                })
                // 保存到 pageList中
                this.setPagelist(locations)
                // 设置数据加载完毕，可以让进度条使用了
                this.setBookAvailable(true)
                // 分页完成之后
                this.refreshLocation()
            })
        }
    },
    mounted(){
        const books = this.$route.params.fileName.split('|')
        const fileName = books[1]
        console.log("fileName",fileName)
        getLocalForage(fileName,(err,blob)=>{
            if(!err && blob){
                this.setFileName(books.join('/'))
                .then(()=>{
                    console.log("找到离线缓存电子书")
                    this.initEpub(blob)
                })
            }else{
                console.log("在线获取电子书")
                this.setFileName(books
                .join('/'))
                .then(()=>{          
                const url = `${process.env.VUE_APP_EPUB_URL}/epub/` 
                + this.fileName + '.epub'
                    this.initEpub(url)
                })
            }
        })
        
    }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.ebook-reader{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask{
        position: absolute;
        top:0;
        left: 0;
        z-index: 150;   
        height: 100%;
        width: 100%;
        background: transparent;
    }
}
</style>