import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import Introduction from '@/views/Introduction.vue'
import Home from '@/views/Home.vue'
import Details from '@/views/Details.vue'
import Settings from '@/views/Settings.vue'
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
  
  // Handle direct navigation with explicit ID types
  if (to.name === 'details') {
    const idType = to.query.source === 'imdb' ? 'imdb' : 'tmdb';
    const id = to.params[`${idType}id`];
    
    if (id) {
      next({
        name: `details-${idType}`,
        params: {
          ...to.params,
          [`${idType}id`]: id
        },
        query: to.query
      });
      return;
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
      path: '/details/:mediaType',
      name: 'details',
      component: Details,
      props: true,
      meta: { requiresServices: true },
      beforeEnter: (to, from, next) => {
        // Ensure at least one ID type is provided
        if (!to.params.tmdbId && !to.params.imdbId) {
          next('/'); // Redirect to home if no ID is provided
          return;
        }
        next();
      },
      children: [
        {
          path: 'tmdb/:tmdbId',
          name: 'details-tmdb',
          component: Details,
          props: true
        },
        {
          path: 'imdb/:imdbId',
          name: 'details-imdb',
          component: Details,
          props: true
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresServices: true }
    },
    // Catch-all route for web-based deep links
    {
      path: '/:pathMatch(.*)*',
      beforeEnter: (_to, _from, next) => {
        next('/');
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const servicesStore = useServicesStore()
  
  // Always load services from localStorage first
  servicesStore.loadFromLocalStorage()

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