export interface DeepLinkParams {
  type: 'movie' | 'show';
  tmdbId?: string;
  imdbId?: string;
  season?: string;
  episode?: string;
}

export function parseDeepLink(url: string): DeepLinkParams | null {
  try {
    // Handle both mediahub:// and https://mediahub.app/ URLs
    const cleanUrl = url.replace('mediahub://', 'https://mediahub.app/');
    const parsedUrl = new URL(cleanUrl);
    const path = parsedUrl.pathname.replace(/^\/+/, ''); // Remove leading slashes
    
    // Handle movie deep links
    if (path === 'movie') {
      const params = Object.fromEntries(parsedUrl.searchParams);
      if (!params.tmdbId && !params.imdbId) {
        throw new Error('Missing required parameter: tmdb or imdb');
      }

      return {
        type: 'movie',
        tmdbId: params.tmdbId,
        imdbId: params.imdbId
      };
    }
    
    // Handle show deep links
    if (path === 'show') {
      const params = Object.fromEntries(parsedUrl.searchParams);
      if (!params.tmdbId && !params.imdbId) {
        throw new Error('Missing required parameter: tmdb or imdb');
      }

      if (params.season !== undefined && !/^\d+$/.test(params.season)) {
        throw new Error('Season must be a non-negative number');
      }
      if (params.episode !== undefined && (!/^\d+$/.test(params.episode) || Number(params.episode) < 1)) {
        throw new Error('Episode must be a positive number');
      }
      if (params.episode !== undefined && params.season === undefined) {
        throw new Error('Episode requires a season');
      }
      
      return {
        type: 'show',
        tmdbId: params.tmdbId,
        imdbId: params.imdbId,
        season: params.season,
        episode: params.episode
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

export function getDeepLinkLocation(params: DeepLinkParams) {
  const mediaType = params.type === 'movie' ? 'movie' : 'tv';
  const id = params.tmdbId || params.imdbId;
  const idType = params.tmdbId ? 'tmdb' : 'imdb';
  
  if (!id) return null;
  
  const query: Record<string, string> = { 
    source: idType,
  };

  if (params.type === 'show' && params.season !== undefined) {
    query.season = params.season;
    if (params.episode !== undefined) query.episode = params.episode;
  }
  
  return {
    name: `details-${idType}`,
    params: { 
      mediaType,
      [`${idType}Id`]: id
    },
    query
  };
}

export function navigateFromDeepLink(router: any, params: DeepLinkParams) {
  const location = getDeepLinkLocation(params);
  if (location) return router.push(location);
}
