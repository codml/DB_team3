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
    component: () => import('../pages/search/SearchPage.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import('../pages/regist/RegistPage.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/price',
    name: 'price',
    component: () => import('../pages/price/PricePage.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/board',
    redirect: '/board/page_1', // 기본 경로를 page_1로 설정
  },
  {
    path: '/board/page_:page', // 동적 경로로 페이지 구분
    name: 'board',
    component: () => import('../pages/board/BoardPage.vue'),
    meta: { requiresAuth: true }, // 인증이 필요한 페이지
    props: true,
  },
  {
    path: '/board/writePost',
    name: 'WritePost',
    component: () => import('../pages/board/writePost/WritePost.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/board/viewPost',
    name: 'ViewPost',
    component: () => import('../pages/board/viewPost/ViewPost.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/board/updatePost',
    name: 'UpdatePost',
    component: () => import('../pages/board/updatePost/UpdatePost.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/userpage',
    name: 'userpage',
    component: () => import('../pages/mypage/UserPage/MyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/adminpage',
    name: 'adminpage',
    component: () => import('../pages/mypage/AdminPage/AdminPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 라우터 가드 추가: 페이지 이동 전에 토큰 확인
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    if (confirm('로그인이 필요합니다. \n로그인 페이지로 이동하시겠습니까?')) {
      next('/login');  // '예' 선택 시 '/login'으로 이동
    } else {
      next('/main');   // '아니오' 선택 시 '/main'으로 이동
    }
  } else {
    // 토큰이 있으면 계속 진행
    next();
  }
});

export default router
