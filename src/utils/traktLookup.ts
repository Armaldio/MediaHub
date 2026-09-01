import { FormattedDetails } from "../models/models";

interface TraktLookupResult {
  type: "movie" | "show";
  movie?: { ids: { slug: string } };
  show?: { ids: { slug: string } };
}

const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID as
  | string
  | undefined;

const cache = new Map<string, string | null>();

export const getTraktSlug = async (
  formattedDetails: FormattedDetails
): Promise<string | null> => {
  if (!formattedDetails.tmdbId) return null;
  const cacheKey = `${formattedDetails.type}-${formattedDetails.tmdbId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  if (!TRAKT_CLIENT_ID) {
    console.warn(
      "VITE_TRAKT_CLIENT_ID is not set; skipping Trakt slug lookup"
    );
    cache.set(cacheKey, null);
    return null;
  }

  const traktType = formattedDetails.type === "tv" ? "show" : "movie";
  const url = `https://api.trakt.tv/search/tmdb/${formattedDetails.tmdbId}?type=${traktType}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
      },
    });

    if (!response.ok) {
      cache.set(cacheKey, null);
      return null;
    }

    const data: TraktLookupResult[] = await response.json();
    const match = data.find((item) => item.type === traktType);
    const ids = match?.movie?.ids ?? match?.show?.ids;
    const slug = ids?.slug ?? null;
    cache.set(cacheKey, slug);
    return slug;
  } catch (error) {
    console.error("Error looking up Trakt slug:", error);
    cache.set(cacheKey, null);
    return null;
  }
};
