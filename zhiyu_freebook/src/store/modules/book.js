const book ={
    state: {
      fileName : '',
      menuVisible : false, //菜单栏和title是否显示
      settingVisible: -1 , //-1 表示不显示 0 表示显示字号， 1 精度， 3目录
      defaultFontSize : 16,
      defaultFontFamily: 'Default',
      fontFamilyVisible: false,
      defaultTheme: 'Default',
      bookAvailable: false, //判断书籍是否加载可用，可用就可以拖动滚动条
      progress: 0, //进度条
      section: 0, //初始页为0，表示第一章节 当前章节的位置
      isPaginating: true,
      currentBook: null, //epub对象
      navigation: null,  //书签数组
      cover: null,  //封面
      metadata: null, //作者和title
      paginate: '', //页数
      pagelist: null, //书籍列表
      offsetY: 0, //y轴偏移
      isBookmark: null //是不是书签
    },
    mutations: {
      'SET_FILENAME' : (state, fileName)=>{
        state.fileName = fileName
      },
      'SET_MENUVISIBLE' : (state , menuVisible) =>{
        state.menuVisible  = menuVisible
      },
      'SET_SETTINGVIESIBLE' :(state , settingVisible) =>{
        state.settingVisible = settingVisible
      },
      'SET_DEFAULT_FONT_SIZE':(state , defaultFontSize) =>{
        state.defaultFontSize = defaultFontSize
      },
      'SET_DEFAULT_FONT_FAMILY': (state, font) => {
        state.defaultFontFamily = font
      },
      'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
        state.fontFamilyVisible = visible
      },
      'SET_DEFAULT_THEME': (state, theme) => {
        state.defaultTheme = theme
      },
      'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
        state.bookAvailable = bookAvailable
      },
      'SET_PROGRESS': (state, progress) => {
        state.progress = progress
      },
      'SET_SECTION': (state, section) => {
        state.section = section
      },
      'SET_IS_PAGINATING': (state, isPaginating) => {
        state.isPaginating = isPaginating
      },
      'SET_CURRENT_BOOK': (state, currentBook) => {
        state.currentBook = currentBook
      },
      'SET_NAVIGATION': (state, navigation) => {
        state.navigation = navigation
      },
      'SET_COVER': (state, cover) => {
        state.cover = cover
      },
      'SET_METADATA': (state, metadata) => {
        state.metadata = metadata
      },
      'SET_PAGINATE': (state, paginate) => {
        state.paginate = paginate
      },
      'SET_PAGELIST': (state, pagelist) => {
        state.pagelist = pagelist
      },
      'SET_OFFSETY': (state, offsetY) => {
        state.offsetY = offsetY
      },
      'SET_IS_BOOKMARK': (state, isBookmark) => {
        state.isBookmark = isBookmark
      },
      'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
        state.speakingIconBottom = speakingIconBottom
      }
    }
  }

export default book