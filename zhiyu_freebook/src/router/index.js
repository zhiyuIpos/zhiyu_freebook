import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/store/home'
  },
  {
    path: '/ebook',
    component : ()=>import(/* webpackChunkName: "ebook" */ '../views/ebook/index.vue')
    ,children:[
      {
        path:':fileName',
        component:()=>import(/* webpackChunkName: "EbookReader" */ '../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path:'/store',
    component : () => import('../views/store/index.vue'),
    children:[
      {
        path:'shelf',
        component:()=>import('../views/store/StoreShelf.vue')
      },
      {
        path:'home', //相对路径
        component : ()=> import('../views/store/StoreHome.vue'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'category', //相对路径
        component : ()=> import('../views/store/StoreCategory.vue')
      },
      {
        path:'list',
        component:()=>import('../views/store/StoreList.vue')
      },
      {
        path:'detail',
        component:()=>import('../views/store/StoreDetail.vue')
      }
    ]
  }
  
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
