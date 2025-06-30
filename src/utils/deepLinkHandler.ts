import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { parseDeepLink } from './deepLink';
import { useRouter } from 'vue-router';

export function setupDeepLinkHandler() {
  const router = useRouter();
  
  // Handle deep links when app is already open
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    // Extract the URL from the event
    const url = new URL(event.url);
    
    // Convert capacitor:// URL to our custom scheme for parsing
    const deepLink = url.toString().replace(/^capacitor:\/\//, 'mediahub://');
    
    // Parse the deep link
    const params = parseDeepLink(deepLink);
    if (params) {
      // Navigate to the appropriate screen
      if (params.type === 'movie') {
        const id = params.tmdbId || params.imdbId;
        if (id) {
          router.push({
            name: 'details',
            params: { 
              mediaType: 'movie', 
              id: id 
            },
            query: { 
              source: params.tmdbId ? 'tmdb' : 'imdb' 
            }
          });
        }
      } else if (params.type === 'show') {
        const id = params.tmdbId || params.imdbId;
        if (id) {
          const query: any = { 
            source: params.tmdbId ? 'tmdb' : 'imdb' 
          };
          
          if (params.season) {
            query.season = params.season;
            if (params.episode) {
              query.episode = params.episode;
            }
          }
          
          router.push({
            name: 'details',
            params: { 
              mediaType: 'tv',
              id: id 
            },
            query
          });
        }
      }
    }
  });

  // For web, we'll handle deep links through the router
  if (import.meta.env.MODE === 'web') {
    // Check for deep link in URL on initial load
    if (window.location.pathname.startsWith('/mediahub/')) {
      const deepLink = window.location.pathname.replace(/^\/mediahub\//, 'mediahub://');
      const params = parseDeepLink(deepLink);
      if (params) {
        if (params.type === 'movie' && (params.tmdbId || params.imdbId)) {
          const id = params.tmdbId || params.imdbId;
          router.push({
            name: 'details',
            params: { 
              mediaType: 'movie', 
              id: id 
            },
            query: { 
              source: params.tmdbId ? 'tmdb' : 'imdb' 
            }
          });
        } else if (params.type === 'show' && (params.tmdbId || params.imdbId)) {
          const id = params.tmdbId || params.imdbId;
          const query: any = { 
            source: params.tmdbId ? 'tmdb' : 'imdb' 
          };
          
          if (params.season) {
            query.season = params.season;
            if (params.episode) {
              query.episode = params.episode;
            }
          }
          
          router.push({
            name: 'details',
            params: { 
              mediaType: 'tv',
              id: id 
            },
            query
          });
        }
      }
    }
  }
}
