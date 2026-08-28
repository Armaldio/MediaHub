// Affiliate templating for website deep links.
// Set via env VITE_AFFILIATE_* — if not set, returns original URL (no-op).
// Keep hub search→redirect spirit: only website fallback, never app scheme.

const AMAZON_TAG = import.meta.env.VITE_AFFILIATE_AMAZON_TAG as string | undefined;
const APPLE_AT = import.meta.env.VITE_AFFILIATE_APPLE_AT as string | undefined;

export function withAffiliate(url: string, serviceId: string): string {
  try {
    const u = new URL(url);
    if (serviceId === 'prime_video' && AMAZON_TAG) {
      // Amazon Prime Video detail pages are amazon.com/gp/video/detail/{id}
      // Affiliate tag param is `tag=`
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', AMAZON_TAG);
    }
    if (serviceId === 'apple_tv_plus' && APPLE_AT) {
      // Apple TV affiliate via `at=` param
      if (!u.searchParams.has('at')) u.searchParams.set('at', APPLE_AT);
    }
    // Google Play / iTunes could be added similarly when you have a tag
    return u.toString();
  } catch {
    return url;
  }
}
