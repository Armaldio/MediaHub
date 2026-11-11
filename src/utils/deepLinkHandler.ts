import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { navigateFromDeepLink, parseDeepLink } from './deepLink';
import { useRouter } from 'vue-router';

export function setupDeepLinkHandler() {
  const router = useRouter();
  let lastNativeUrl: string | null = null;
  let lastNativeUrlAt = 0;

  const handleNativeUrl = (url: string) => {
    if (url === lastNativeUrl && Date.now() - lastNativeUrlAt < 1000) return;
    lastNativeUrl = url;
    lastNativeUrlAt = Date.now();
    const deepLink = url.replace(/^capacitor:\/\//, 'mediahub://');
    const params = parseDeepLink(deepLink);
    if (params) navigateFromDeepLink(router, params);
  };
  
  // Handle deep links when app is already open
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    handleNativeUrl(event.url);
  });

  if (Capacitor.isNativePlatform()) {
    void App.getLaunchUrl().then((launch) => {
      if (launch?.url) handleNativeUrl(launch.url);
    }).catch((error) => console.error('Unable to read app launch URL:', error));
  }

  // For web, we'll handle deep links through the router
  if (!Capacitor.isNativePlatform()) {
    // Check for deep link in URL on initial load
    if (window.location.pathname.startsWith('/mediahub/')) {
      const deepLink = `${window.location.pathname.replace(/^\/mediahub\//, 'mediahub://')}${window.location.search}`;
      const params = parseDeepLink(deepLink.toString());
      console.log('deepLink', deepLink.toString());
      console.log('params', JSON.stringify(params));  
      if (params) {
        navigateFromDeepLink(router, params);
      }
    }
  }
}
