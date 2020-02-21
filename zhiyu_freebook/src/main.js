import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/icon.css'
// 第二种，存放到assets目录下 @代表src
import '@/assets/fonts/daysOne.css'
// 全局样式文件
import '@/assets/styles/global.scss'
// 语言
import i18n from './lang'
// mockjs
// import './mock'

import './utils/create-api'

import { Image,Lazyload } from 'vant';
Vue.use(Image)
Vue.use(Lazyload,{
  lazyComponent: true
});

// import 
import './utils/boost'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
