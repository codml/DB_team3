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
    path: '/mypage',
    name: 'mypage',
    component: () => import('../pages/mypage/MyPage.vue')
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
    redirect: '/board/page_1', // 기본 경로를 page_1로 설정
  },
  {
    path: '/board/page_:page', // 동적 경로로 페이지 구분
    name: 'board',
    component: () => import('../pages/board/BoardPage.vue'),
    props: true,
  },
  {
    path: '/board/writePost',
    name: 'WritePost',
    component: () => import('../pages/board/writePost/WritePost.vue')
  },
  {
    path: '/board/viewPost',
    name: 'ViewPost',
    component: () => import('../pages/board/viewPost/ViewPost.vue')
  },
  {
    path: '/board/updatePost',
    name: 'UpdatePost',
    component: () => import('../pages/board/updatePost/UpdatePost.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
