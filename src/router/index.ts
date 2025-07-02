import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import Introduction from '@/views/Introduction.vue'
import Home from '@/views/Home.vue'
import Details from '@/views/Details.vue'
import { useServicesStore } from '@/stores/services'
import { parseDeepLink, navigateFromDeepLink } from '@/utils/deepLink'

// Handle deep link navigation
const handleDeepLink: NavigationGuard = (to, _from, next) => {
  // Check for deep link in query parameters (web fallback)
  if (to.query.deep_link) {
    const deepLink = Array.isArray(to.query.deep_link) 
      ? to.query.deep_link[0] 
      : to.query.deep_link || '';
    
    if (deepLink) {
      const params = parseDeepLink(deepLink);
      if (params) {
        navigateFromDeepLink(router, params);
        return;
      }
    }
  }
  
  next();
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'introduction',
      component: Introduction,
      beforeEnter: handleDeepLink
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresServices: true },
      beforeEnter: handleDeepLink
    },
    {
      path: '/details/:mediaType/:id',
      name: 'details',
      component: Details,
      props: true,
      meta: { requiresServices: true },
      beforeEnter: handleDeepLink
    },
    // Catch-all route for web-based deep links
    {
      path: '/:pathMatch(.*)*',
      beforeEnter: (to, from, next) => {
        // Check if this is a deep link
        if (to.path.startsWith('/mediahub/')) {
          const deepLink = to.path.replace(/^\/mediahub\//, 'mediahub://');
          const params = parseDeepLink(deepLink);
          if (params) {
            navigateFromDeepLink(router, params);
            return;
          }
        }
        next('/');
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const servicesStore = useServicesStore()
  
  // Always load services from localStorage first
  servicesStore.loadFromLocalStorage()

  console.log('servicesStore.hasSelectedServices', servicesStore.hasSelectedServices);
  console.log('to', JSON.stringify(to));
  console.log('from', JSON.stringify(from));
  console.log('servicesStore.selectedServices', JSON.stringify(servicesStore.selectedServices));
  
  // If we're going to introduction but have services selected, redirect to home
  if (to.name === 'introduction' && servicesStore.hasSelectedServices && to.query.force !== '1') {
    next({ name: 'home' })
    return
  }
  
  // Existing requiresServices check
  if (to.meta.requiresServices && !servicesStore.hasSelectedServices) {
    next({ name: 'introduction' })
    return
  }
  
  next()
})

export default router