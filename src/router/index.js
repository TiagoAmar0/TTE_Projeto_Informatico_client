import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' },
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
    {
      path: '/services/:id/schedules',
      name: 'service.schedules',
      component: () => import('../views/Services/Schedules/Index.vue')
    },
    {
      path: '/services/:id/schedules/add',
      name: 'service.schedules.add',
      component: () => import('../views/Services/Schedules/Add.vue')
    },
    {
      path: '/services/:id/schedules/:schedule',
      name: 'service.schedules.show',
      component: () => import('../views/Services/Schedules/Show.vue')
    },
    {
      path: '/services/:id/schedules/:schedule/edit',
      name: 'service.schedules.edit',
      component: () => import('../views/Services/Schedules/Edit.vue')
    },
    /**
     * Swaps
     */
    {
      path: '/swaps/propose',
      name: 'swaps.propose',
      component: () => import('../views/Swaps/Propose.vue')
    },
    {
      path: '/swaps/sent',
      name: 'swaps.sent',
      component: () => import('../views/Swaps/SwapsSent.vue')
    },
    {
      path: '/swaps/received',
      name: 'swaps.received',
      component: () => import('../views/Swaps/SwapsReceived.vue')
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
    },
    /**
     * User Shifts
     */
    {
      path: '/my-shifts',
      name: 'user.shifts',
      component: () => import('../views/Shifts/UserShiftsList.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.name === 'login' || to.name === 'reset-password') {
    if(sessionStorage.getItem('token'))
      sessionStorage.removeItem('token')

    next()
    return
  }

  if(!sessionStorage.getItem('token')){
    next({ name: 'login' })
    return
  }

  next()
})

export default router
