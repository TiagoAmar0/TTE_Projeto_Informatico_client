import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Authentication/Login.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services/Index.vue')
    },
    {
      path: '/services/:id',
      name: 'service.show',
      component: () => import('../views/Services/Show.vue')
    },
    {
      path: '/services/:id/associate',
      name: 'service.associate_nurse',
      component: () => import('../views/Services/Associate.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.name === 'index'){
    next('/dashboard')
  }

  if(to.name === 'login') {
    if(sessionStorage.getItem('token')){
      next('/dashboard')
    } else {
      next()
    }
    return
  }

  if(!sessionStorage.getItem('token')){
    next('/login')
    return
  }

  next()
})

export default router
