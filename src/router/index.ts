import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/not-found/NotFound.vue')
    },
    {
      path: '/test',
      component: () => import('@/views/test/Test')
    },
    {
      path: '/login',
      component: () => import('@/views/login/Login.js')
    },
    {
      path: '/main',
      component: () => import('@/views/main/Main.vue')
    },
    {
      path: '/task',
      component: () => import('@/views/task/TaskDev.vue')
    }
  ]
})

export default router
