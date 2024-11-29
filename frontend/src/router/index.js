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
    component: () => import('../pages/mypage/UserPage/MyPage.vue')
  },
  {
    path: '/mypage/edit',
    name: 'mypageedit',
    component: () => import('../pages/mypage/UserPage/MyPageEdit.vue')
  },
  {
    path: '/mypage/sale',
    redirect: '/mypage/sale/page_1', // 기본 경로를 page_1로 설정
  },
  {
    path: '/mypage/sale/page_:page',
    name: 'mysale',
    component: () => import('../pages/mypage/UserPage/MyPageSale.vue')
  },
  {
    path: '/mypage/purchase',
    redirect: '/mypage/purchase/page_1', // 기본 경로를 page_1로 설정
  },
  {
    path: '/mypage/purchase/page_:page',
    name: 'mypurchase',
    component: () => import('../pages/mypage/UserPage/MyPagePurchase.vue')
  },
  {
    path: '/mypage/like',
    redirect: '/mypage/like/page_1', // 기본 경로를 page_1로 설정
  },
  {
    path: '/mypage/like/page_:page',
    name: 'mylike',
    component: () => import('../pages/mypage/UserPage/MyPageLike.vue')
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
    path: '/read/:ino',
    name: 'read',
    component: () => import('../pages/search/ReadPage.vue'),
    meta: { requiresAuth: true }, // 인증이 필요한 페이지
    props: true
  },
  {
    path: '/request/:ino',
    name: 'request',
    component: () => import('../pages/search/RequestPage.vue'),
    meta: { requiresAuth: true }, // 인증이 필요한 페이지
    props: true
  },
  {
    path: '/update/:ino',
    name: 'update',
    component: () => import('../pages/search/UpdatePage.vue'),
    meta: { requiresAuth: true }, // 인증이 필요한 페이지
    props: true
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
    component: () => import('../pages/board/WritePost.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/board/viewPost',
    name: 'ViewPost',
    component: () => import('../pages/board/ViewPost.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 페이지
  },
  {
    path: '/board/updatePost',
    name: 'UpdatePost',
    component: () => import('../pages/board/UpdatePost.vue'),
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
