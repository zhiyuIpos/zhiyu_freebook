import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

Vue.use(VueI18n)

const messages = {
  en, cn
}

// 通过获取
let locale = getLocale()
if (!locale) {
  // 默认是cn
  locale = 'cn'
  // 没有就保存为中文
  // 保存到localstorage中
  saveLocale(locale)
}

// 
const i18n = new VueI18n({
  // 语言
  locale:'cn',
  // 语言对应的文本
  messages, // set locale messages
  silentTranslationWarn: true,
})

export default i18n
