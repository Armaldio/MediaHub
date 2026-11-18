import { createRouter, createWebHistory } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { parseDeepLink, getDeepLinkLocation } from '@/utils/deepLink'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'introduction',
      component: () => import('@/views/Introduction.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresServices: true }
    },
    {
      path: '/details/:mediaType/tmdb/:tmdbId',
      name: 'details-tmdb',
      component: () => import('@/views/Details.vue'),
      props: true,
      meta: { requiresServices: true },
    },
    {
      path: '/details/:mediaType/imdb/:imdbId',
      name: 'details-imdb',
      component: () => import('@/views/Details.vue'),
      props: true,
      meta: { requiresServices: true },
    },
    {
      path: '/details/:mediaType',
      name: 'details',
      redirect: { name: 'introduction' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresServices: true }
    },
    {
      path: '/:linkType(movie|show)',
      alias: '/mediahub/:linkType(movie|show)',
      redirect: (to) => {
        const query = new URLSearchParams()
        for (const key of ['tmdbId', 'imdbId', 'season', 'episode']) {
          const value = to.query[key]
          if (typeof value === 'string') query.set(key, value)
        }
        return {
          name: 'introduction',
          query: { deep_link: `mediahub://${to.params.linkType}?${query}` },
        }
      },
    },
    // Catch-all route for web-based deep links
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'introduction' }
    }
  ]
})

router.beforeEach((to) => {
  const servicesStore = useServicesStore()
  servicesStore.loadFromLocalStorage()

  const links = to.query.deep_link
  const deepLink = Array.isArray(links) ? links[0] : links
  if (typeof deepLink === 'string') {
    const params = parseDeepLink(deepLink)
    const location = params && getDeepLinkLocation(params)
    if (location) return location
  }

  if (to.meta.requiresServices && !servicesStore.hasSelectedServices) {
    const isDetails = to.name === 'details-tmdb' || to.name === 'details-imdb'
    return { name: 'introduction', query: isDetails ? { continueTo: to.fullPath } : {} }
  }

  if ((to.name === 'introduction' || to.name === 'home') && servicesStore.hasSelectedServices) {
    const destination = to.query.continueTo
    if (typeof destination === 'string' && /^\/details\//.test(destination)) {
      const resolved = router.resolve(destination)
      if (resolved.name === 'details-tmdb' || resolved.name === 'details-imdb') {
        return { path: resolved.path, query: resolved.query, replace: true }
      }
    }
    if (to.name === 'home' && destination !== undefined) {
      const query = { ...to.query }
      delete query.continueTo
      return { name: 'home', query, replace: true }
    }
    if (to.name === 'introduction' && to.query.force !== '1') {
      return { name: 'home', query: to.query }
    }
  }
})

export default router
