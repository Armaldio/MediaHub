import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { navigateFromDeepLink, parseDeepLink } from './deepLink';
import { useRouter } from 'vue-router';

export function setupDeepLinkHandler() {
  const router = useRouter();
  
  // Handle deep links when app is already open
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    // Extract the URL from the event
    const url = new URL(event.url);

    console.log('url', url.toString());
    
    // Convert capacitor:// URL to our custom scheme for parsing
    const deepLink = url.toString().replace(/^capacitor:\/\//, 'mediahub://');
    console.log('deepLink', deepLink.toString());
    
    // Parse the deep link
    const params = parseDeepLink(deepLink.toString());
    console.log('params', JSON.stringify(params));  
    if (params) {
      navigateFromDeepLink(router, params);
    }
  });

  // For web, we'll handle deep links through the router
  if (import.meta.env.MODE === 'web') {
    // Check for deep link in URL on initial load
    if (window.location.pathname.startsWith('/mediahub/')) {
      const deepLink = window.location.pathname.replace(/^\/mediahub\//, 'mediahub://');
      const params = parseDeepLink(deepLink.toString());
      console.log('deepLink', deepLink.toString());
      console.log('params', JSON.stringify(params));  
      if (params) {
        navigateFromDeepLink(router, params);
      }
    }
  }
}