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
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/Authentication/ResetPassword.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Authentication/Profile.vue')
    },
    /**
     * Services
     */
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services/Index.vue')
    },
    {
      path: '/services/add',
      name: 'services.add',
      component: () => import('../views/Services/Add.vue')
    },
    {
      path: '/services/:id',
      name: 'service.show',
      component: () => import('../views/Services/Show.vue')
    },
    {
      path: '/services/:id/edit',
      name: 'service.edit',
      component: () => import('../views/Services/Edit.vue')
    },
    /**
     * Users
     */
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users/Index.vue')
    },
    {
      path: '/users/add',
      name: 'users.add',
      component: () => import('../views/Users/Add.vue')
    },
    {
      path: '/users/:id',
      name: 'user.show',
      component: () => import('../views/Users/Show.vue')
    },
    {
      path: '/users/:id/edit',
      name: 'user.edit',
      component: () => import('../views/Users/Edit.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.name === 'index'){
    next('/dashboard')
  }

  if(to.name === 'login' || to.name === 'reset-password') {
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
