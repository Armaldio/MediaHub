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
      if (!params.tmdb && !params.imdb) {
        throw new Error('Missing required parameter: tmdb or imdb');
      }
      
      return {
        type: 'movie',
        tmdbId: params.tmdb,
        imdbId: params.imdb
      };
    }
    
    // Handle show deep links
    if (path === 'show') {
      const params = Object.fromEntries(parsedUrl.searchParams);
      if (!params.tmdb && !params.imdb) {
        throw new Error('Missing required parameter: tmdb or imdb');
      }
      
      return {
        type: 'show',
        tmdbId: params.tmdb,
        imdbId: params.imdb,
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
          mediaType: 'tv', // Assuming 'tv' is the type for shows in your app
          id: id 
        },
        query
      });
    }
  }
}
