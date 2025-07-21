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

export function navigateFromDeepLink(router: any, params: DeepLinkParams) {
  const mediaType = params.type === 'movie' ? 'movie' : 'tv';
  const id = params.tmdbId || params.imdbId;
  const idType = params.tmdbId ? 'tmdb' : 'imdb';
  
  if (!id) return;
  
  const query: Record<string, string> = { 
    source: idType,
  };
  
  // if (params.type === 'show') {
  //   if (params.season) {
  //     query.season = params.season;
  //     if (params.episode) {
  //       query.episode = params.episode;
  //     }
  //   }
  // }
  
  router.push({
    name: `details-${idType}`,
    params: { 
      mediaType,
      [`${idType}Id`]: id
    },
    query
  });
}
