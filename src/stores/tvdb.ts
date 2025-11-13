import { defineStore } from "pinia";
import { ref } from "vue";

// TVDB API Types
interface TVDBAuthToken {
  data: {
    token: string;
  };
}

interface TVDBImage {
  id: number;
  type: number;
  typeName: string;
  fileName: string;
  resolution: string;
  ratingsInfo: {
    average: number;
    count: number;
  };
  thumbnail: string;
  languageId: number;
  keyType: string;
  subKey: string;
  fileName2: string;
  thumbnail2: string;
  language: string;
}

interface TVDBSeriesImages {
  poster: TVDBImage[];
  fanart: TVDBImage[];
  season: TVDBImage[];
  seasonwide: TVDBImage[];
  series: TVDBImage[];
}

interface TVDBMovieImages {
  poster: TVDBImage[];
  fanart: TVDBImage[];
  background: TVDBImage[];
  banner: TVDBImage[];
  icon: TVDBImage[];
  clearart: TVDBImage[];
  clearlogo: TVDBImage[];
}

// TVDB API base URL
const TVDB_BASE_URL = "https://api4.thetvdb.com/v4";

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export const useTVDBStore = defineStore("tvdb", () => {
  // State
  const authToken = ref<string | null>(null);
  const tokenExpiry = ref<number | null>(null);
  const cache = ref<Record<string, CacheEntry<any>>>({});

  // Cache TTL (24 hours)
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  // Get cached data if still valid
  const getCached = <T>(key: string): T | null => {
    const entry = cache.value[key];
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      delete cache.value[key];
      return null;
    }

    return entry.data;
  };

  // Set cached data
  const setCached = <T>(key: string, data: T, ttl: number = CACHE_TTL) => {
    cache.value[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    };
  };

  // Authenticate with TVDB API
  const authenticate = async (): Promise<void> => {
    try {
      const apiKey = import.meta.env.VITE_TVDB_API_KEY;
      // const apiPin = import.meta.env.VITE_TVDB_API_PIN

      if (!apiKey /* || !apiPin */) {
        throw new Error("TVDB API credentials not configured");
      }

      const response = await fetch(`${TVDB_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apikey: apiKey,
          // pin: apiPin
        }),
      });

      if (!response.ok) {
        throw new Error(`TVDB authentication failed: ${response.status}`);
      }

      const data: TVDBAuthToken = await response.json();

      if (!data.data?.token) {
        throw new Error("TVDB authentication failed: No token received");
      }

      authToken.value = data.data.token;
      console.log("authToken.value", authToken.value);

      // Token expires in 24 hours, but we'll refresh after 23 hours to be safe
      tokenExpiry.value = Date.now() + 23 * 60 * 60 * 1000;
    } catch (error) {
      console.error("TVDB authentication error:", error);
      throw error;
    }
  };

  // Ensure we have a valid token
  const ensureAuthenticated = async (): Promise<void> => {
    const now = Date.now();

    console.log(
      "ensureAuthenticated",
      authToken.value,
      tokenExpiry.value,
      now,
      tokenExpiry.value && now >= tokenExpiry.value
    );

    if (!authToken.value || !tokenExpiry.value || now >= tokenExpiry.value) {
      await authenticate();
    }
  };

  // Get best poster image URL
  const getBestPosterUrl = (images: TVDBImage[]): string | null => {
    if (!images || images.length === 0) return null;

    // Sort by ratings (highest rated first)
    const sorted = images.sort(
      (a, b) => b.ratingsInfo.average - a.ratingsInfo.average
    );

    // Return the highest rated poster
    return sorted[0]?.fileName
      ? `https://artworks.thetvdb.com/banners/${sorted[0].fileName}`
      : null;
  };

  // Get best fanart/backdrop image URL
  const getBestFanartUrl = (images: TVDBImage[]): string | null => {
    if (!images || images.length === 0) return null;

    // Sort by ratings (highest rated first)
    const sorted = images.sort(
      (a, b) => b.ratingsInfo.average - a.ratingsInfo.average
    );

    // Return the highest rated fanart
    return sorted[0]?.fileName
      ? `https://artworks.thetvdb.com/banners/${sorted[0].fileName}`
      : null;
  };

  // Get series details by TVDB ID
  const getSeriesDetails = async (tvdbId: string): Promise<any | null> => {
    const cacheKey = `series_details_${tvdbId}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    try {
      await ensureAuthenticated();

      const response = await fetch(`${TVDB_BASE_URL}/series/${tvdbId}`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setCached(cacheKey, null);
          return null;
        }
        throw new Error(`Failed to fetch series details: ${response.status}`);
      }

      const data = await response.json();
      const details = data.data;
      const result = { ...details, slug: details.slug };

      setCached(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error fetching series details:", error);
      return null;
    }
  };

  // Get movie details by TVDB ID
  const getMovieDetails = async (tvdbId: string): Promise<any | null> => {
    const cacheKey = `movie_details_${tvdbId}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    try {
      await ensureAuthenticated();

      console.log("authToken.value", authToken.value);

      const response = await fetch(`${TVDB_BASE_URL}/movies/${tvdbId}`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setCached(cacheKey, null);
          return null;
        }
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }

      const data = await response.json();
      const details = data.data;
      const result = { ...details, slug: details.slug };

      setCached(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  // Clear cache
  const clearCache = () => {
    cache.value = {};
  };

  return {
    authToken,
    tokenExpiry,
    authenticate,
    ensureAuthenticated,
    getSeriesDetails,
    getMovieDetails,
    getBestPosterUrl,
    getBestFanartUrl,
    clearCache,
  };
});
