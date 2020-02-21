import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

// 获取书籍信息
export function getBookObject(fileName, key) {
  let book =getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}

// 存储fileName key ,value，每一本电子书都缓存不一样的数据
export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if(!book){
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}

// 获取存储字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

// 保存字体
export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

export function getTheme(fileName) {
  // 获取
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  // 保存
  setBookObject(fileName, 'theme', theme)
}

// 获取字体
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
// 保存字体
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}

// 国际化获取语言
export function getLocale() {
  return getLocalStorage('locale')
}

// 国际化保存语言
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}



// 阅读进度保存
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}  
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

// 书架
export function getBookShelf(){
  return getLocalStorage('shelf')
}

export function saveBookShelf(shelf){
  return setLocalStorage('shelf',shelf)
}