import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../stores/auth'


import About from '@/views/About.vue'
import Login from '@/views/Login.vue'

const routes = [
  {

    path: '/about',
    component: About
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (!auth.isLogged && to.path !== '/login') {
    return '/login'
  } else if (auth.isLogged && to.path === '/login') {
    return from ? from.path : '/'
  }
})

export default router
