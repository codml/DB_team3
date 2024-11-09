import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../pages/main/MainPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/LoginPage.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../pages/signup/SignUPPage.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/search/SearchPage.vue')
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import('../pages/regist/RegistPage.vue')
  },
  {
    path: '/price',
    name: 'price',
    component: () => import('../pages/price/PricePage.vue')
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../pages/board/BoardPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
