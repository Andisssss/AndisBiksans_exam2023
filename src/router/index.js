import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Songs from '../views/Songs.vue'
import About from '../views/About.vue'
import Albums from '../views/Albums.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/',
      component: Songs,
    },
    {
      path: '/albums',
      component: Albums,
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = auth.IsLoggedIn;

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;