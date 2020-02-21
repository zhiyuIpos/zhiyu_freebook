// 使用mixin来混入 ，因为有多个组件都会用到那些值
// 所有使用mixin来合并，到时候使用，直接引入mixin就可以了
// 实现代码复用 ，可以再这里修改
import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList,addCss, removeAllCss ,getReadTimeByMinute} from './book'
import {saveLocation, getBookmark,getBookShelf, saveBookShelf} from './localStorage'
import { appendAddToShelf,gotoBookDetail} from './store'
import {shelf } from '../api/store'
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible', //
      'defaultFontSize', //设置默认的字体
      'defaultFontFamily', //默认的字体
      'fontFamilyVisible', //设置字体框是否可见
      'defaultTheme', //默认的主题
      'bookAvailable', //当前书籍是否加载完成
      'progress', //进度条
      'section', //章节
      'isPaginating', //是不是页数加载完成
      'currentBook', //存的是当前的电子书实例
      'navigation', //存的是目录
      'cover', //封面
      'metadata',//作者和title信息
      'paginate',//页数
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList() {
      return themeList(this)
    },
    // 获取到章节的命称
    getSectionName(){
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST,
      fontFamily: FONT_FAMILY
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible', 
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    showFontFamilySetting() {
      this.setFontFamilyVisible(true)
    },
    showSetting(key) {
      this.setSettingVisible(key)
    },
    hideMenuVisible() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    toggleMenuVisible() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideFontFamilySetting() {
      this.setFontFamilyVisible(false)
    },
    // 全局的样式切换功能，通过动态添加css
    initGlobalStyle(){
      removeAllCss()
      switch(this.defaultTheme){
          case 'Default':
              addCss(`${process.env.VUE_APP_EPUB_URL}/theme/theme_default.css`)
              break;
          case 'Eye' :
              addCss(`${process.env.VUE_APP_EPUB_URL}/theme/theme_eye.css`)
              break;
          case 'Gold':
              addCss(`${process.env.VUE_APP_EPUB_URL}/theme/theme_gold.css`)
              break;
          case 'Night':    
              addCss(`${process.env.VUE_APP_EPUB_URL}/theme/theme_night.css`)
              break;
          default :
              addCss(`${process.env.VUE_APP_EPUB_URL}/theme/theme_default.css`)
      }
    },
    // 注册主题
    registerTheme() {
      this.themeList.forEach(theme => {
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },
    switchTheme() {
      const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
      if (this.defaultFontFamily && this.defaultFontFamily !== 'Default') {
        rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
      } else {
        rules.style.body['font-family'] = `Times New Roman!important`
      }
      this.registerTheme()
      this.currentBook.rendition.themes.select(this.defaultTheme)
      this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
      this.setGlobalTheme(this.defaultTheme)
    },
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        this.switchTheme()
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },
    setTheme(theme) {
      this.setDefaultTheme(theme).then(() => {
        this.switchTheme()
        Storage.saveTheme(this.fileName, theme)
      })
    },
    setFontFamily(font) {
      this.setDefaultFontFamily(font).then(() => {
        this.switchTheme()
        Storage.saveFontFamily(this.fileName, font)
      })
    },
    // 章节跳转
    displaySection(cb) {
      // section方法是epubjs提供的切换章节的方法
      const section = this.currentBook.section(this.section)
      if (section && section.href) {
        // display方法用于展示
        this.currentBook.rendition.display(section.href).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    // 设置进度条
    displayProgress() {
      // 实现拖动进度条的功能， 
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // this.currentBook.rendition.display(cfi).then(() => {
      //   this.refreshLocation()
      // })
      this.display(cfi)
    }, 
    // 刷新当前的位置
    refreshLocation() {
      // 显示 %
      // currentLocation 会打印start 和 end 
      const currentLocation = this.currentBook.rendition.currentLocation()
      // 判断是否存在，存在再执行
      if(currentLocation && currentLocation.start){
        // 通过cfi来进行跳转，实现进度条功能 
        //  percentageFromCfi进度xx%
        // 需要乘以100 变为整数
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100)) //变为整数
        // 保存当前阅读进度
        const startCfi = currentLocation.start.cfi
        // 将section的值刷新 ，章节就会刷新
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName,startCfi)
        // 获取bookmark
        const bookmark = getBookmark(this.fileName)
        // 书签
        if(bookmark){
          if(bookmark.some(item => item.cfi === startCfi)){
            this.setIsBookmark(true)
          }else{
            this.setIsBookmark(false)
          }
        }else{
          this.setIsBookmark(false)
        }
        // 显示页数（）
        if(this.pagelist){
          // 总页数
          const totalPage = this.pagelist.length
          // 当前页数
          const currentPage = currentLocation.start.location
          // 如果当前页数存在 并且 大于0时 ，就拼接在一起
          if(currentPage && currentPage > 0){
             this.setPaginate(currentPage + '/' + totalPage)
          }else{
            this.setPaginate('')
          }
        }else{
          this.setPaginate('')
        }
      }
    },
    // 渲染指定连接下的什么页面
    display(target, cb) {
      if(target){
        this.currentBook.rendition.display(target).then(()=>{
          this.refreshLocation()
          // cd为回调函数，有就执行
          if(cb) cb()
        })
      }else{
        this.currentBook.rendition.display().then(()=>{
          this.refreshLocation()
          if(cb) cb()
        })
      }
    },
    // 阅读时间
    getReadTime() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    },
    // 
    hideTitleAndMenu(){
      //this.$store.dispatch('setMenuVisible',false)
      this.setMenuVisible(false)
      // 隐藏面板的时候后，需要把子菜单隐藏
      this.setSettingVisible(-1)
      // 隐藏显示字体面板
       this.setFontFamilyVisible(false)
    },
    // 进度条阅读章节
    getReadTimeText(){
      // 获取阅读时间
      return this.$t('book.haveRead').replace('$1',getReadTimeByMinute(this.fileName))
    },
  }
}

export const ebookHome = {
  methods: {
    showBookDetail(item) {
      showBookDetail(this, item)
    }
  }
}
export const storeHomeMixin ={
  computed:{
    ...mapGetters(['offsetY','hotSearchOffsetY','flapCardVisible'])
  },
  methods:{
    ...mapActions(['setOffsetY','setHotSearchOffsetY','setFlapCardVisible']),
    showBookDetail(book){
      gotoBookDetail(this,book)
    }
  }
}


export const storeShelfMixin={
  computed:{
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods:{
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
      
    ]),
    showBookDetail(book){
      gotoBookDetail(this,book)
    },
    getCategoryList(title){
      this.getShelfList().then(()=>{
        const categoryList = this.shelfList.filter(book=>
        book.type === 2 && book.title === title)[0] 
        this.setShelfCategory(categoryList)
      })
    },
    getShelfList(){
      let shelfList = getBookShelf()
      if(!shelfList){
        shelf().then(res=>{
          if(res.status === 200 && res.data && res.data.bookList){
            shelfList = appendAddToShelf(res.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
        // this.setShelfList(appendAddToShelf([]))
      }else{
        return this.setShelfList(shelfList)
      }
    }
  }
}