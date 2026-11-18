import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { navigateFromDeepLink, parseDeepLink } from './deepLink';
import type { Router } from 'vue-router';

export function setupDeepLinkHandler(router: Router) {
  if (!Capacitor.isNativePlatform()) return;
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
  void App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    handleNativeUrl(event.url);
  }).catch((error) => console.error('Unable to subscribe to app links:', error));

  void App.getLaunchUrl().then((launch) => {
    if (launch?.url) handleNativeUrl(launch.url);
  }).catch((error) => console.error('Unable to read app launch URL:', error));
}
