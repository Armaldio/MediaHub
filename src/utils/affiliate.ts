// Affiliate templating for website deep links.
// Set via env VITE_AFFILIATE_* — if not set, returns original URL (no-op).
// Keep hub search→redirect spirit: only website fallback, never app scheme.

// Unified affiliate: set VITE_AFFILIATE_TAG once and it applies to all
// website deep links. Per-service overrides still work (e.g. VITE_AFFILIATE_AMAZON_TAG).
const UNIFIED_TAG = import.meta.env.VITE_AFFILIATE_TAG as string | undefined;

const AMAZON_TAG = (import.meta.env.VITE_AFFILIATE_AMAZON_TAG as string | undefined) || UNIFIED_TAG;
const APPLE_AT = (import.meta.env.VITE_AFFILIATE_APPLE_AT as string | undefined) || UNIFIED_TAG;
const HULU_TAG = (import.meta.env.VITE_AFFILIATE_HULU_TAG as string | undefined) || UNIFIED_TAG;
const PEACOCK_TAG = (import.meta.env.VITE_AFFILIATE_PEACOCK_TAG as string | undefined) || UNIFIED_TAG;
const PARAMOUNT_TAG = (import.meta.env.VITE_AFFILIATE_PARAMOUNT_TAG as string | undefined) || UNIFIED_TAG;
const MAX_TAG = (import.meta.env.VITE_AFFILIATE_MAX_TAG as string | undefined) || UNIFIED_TAG;
const DISNEY_TAG = (import.meta.env.VITE_AFFILIATE_DISNEY_TAG as string | undefined) || UNIFIED_TAG;
const CRUNCHYROLL_TAG = (import.meta.env.VITE_AFFILIATE_CRUNCHYROLL_TAG as string | undefined) || UNIFIED_TAG;

export function withAffiliate(url: string, serviceId: string): string {
  try {
    const u = new URL(url);
    if (serviceId === 'prime_video' && AMAZON_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', AMAZON_TAG);
    }
    if ((serviceId === 'apple_tv_plus' || serviceId === 'itunes') && APPLE_AT) {
      if (!u.searchParams.has('at')) u.searchParams.set('at', APPLE_AT);
    }
    if (serviceId === 'hulu' && HULU_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', HULU_TAG);
    }
    if (serviceId === 'peacock' && PEACOCK_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', PEACOCK_TAG);
    }
    if (serviceId === 'paramount_plus' && PARAMOUNT_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', PARAMOUNT_TAG);
    }
    if (serviceId === 'max' && MAX_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', MAX_TAG);
    }
    if (serviceId === 'disney_plus' && DISNEY_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', DISNEY_TAG);
    }
    if (serviceId === 'crunchyroll' && CRUNCHYROLL_TAG) {
      if (!u.searchParams.has('tag')) u.searchParams.set('tag', CRUNCHYROLL_TAG);
    }
    return u.toString();
  } catch {
    return url;
  }
}
