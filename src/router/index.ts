import { createRouter, createWebHistory } from 'vue-router'
import Introduction from '@/views/Introduction.vue'
import Home from '@/views/Home.vue'
import Details from '@/views/Details.vue'
import { useServicesStore } from '@/stores/services'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'introduction',
      component: Introduction
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresServices: true }
    },
    {
      path: '/details/:mediaType/:id',
      name: 'details',
      component: Details,
      props: true,
      meta: { requiresServices: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresServices) {
    const servicesStore = useServicesStore()
    servicesStore.loadFromLocalStorage()
    
    if (!servicesStore.hasSelectedServices) {
      next({ name: 'introduction' })
      return
    }
  }
  next()
})

export default router