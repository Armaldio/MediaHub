import { Service } from "@/types";

export default [
  {
    "id": "netflix",
    "name": "Netflix",
    "description": "Stream movies and TV shows",
    "icon": "🎬",
    "websiteUrl": "https://netflix.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    "androidAppId": "com.netflix.mediaclient",
    "color": "#E50914",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `netflix://title/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "prime_video",
    "name": "Prime Video",
    "description": "Amazon's streaming service",
    "icon": "📺",
    "websiteUrl": "https://primevideo.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient",
    "androidAppId": "com.amazon.avod.thirdpartyclient",
    "color": "#00A8E1",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `aiv://aiv/resume?asin=${data.tmdbId}`
      }
    ]
  },
  {
    "id": "disney_plus",
    "name": "Disney+",
    "description": "Stream Disney, Pixar, Marvel, Star Wars, and more",
    "icon": "🏰",
    "websiteUrl": "https://www.disneyplus.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
    "androidAppId": "com.disney.disneyplus",
    "color": "#113CCF",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `disneyplus://content/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.disneyplus.com/movies//${data.tmdbId}`
      }
    ]
  },
  {
    "id": "hulu",
    "name": "Hulu",
    "description": "Stream current shows and movies",
    "icon": "🟢",
    "websiteUrl": "https://hulu.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.hulu.plus",
    "androidAppId": "com.hulu.plus",
    "color": "#1CE783",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `hulu://watch/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "hbo_max",
    "name": "Max",
    "description": "Stream HBO, Warner Bros, DC, and more",
    "icon": "📺",
    "websiteUrl": "https://www.max.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.hbo.hbonow",
    "androidAppId": "com.hbo.hbonow",
    "color": "#8B00FF",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `hbonow://content/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://play.max.com/movie/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "apple_tv_plus",
    "name": "Apple TV+",
    "description": "Apple Original shows and movies",
    "icon": "🍎",
    "websiteUrl": "https://tv.apple.com",
    "appUrl": "https://apps.apple.com/app/apple-tv/id1174078549",
    "androidAppId": "com.apple.atve.android.appletv",
    "color": "#000000",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `https://tv.apple.com/movie/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "paramount_plus",
    "name": "Paramount+",
    "description": "CBS, Nickelodeon & more",
    "icon": "⭐",
    "websiteUrl": "https://paramountplus.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.cbs.app",
    "androidAppId": "com.cbs.app",
    "color": "#0064FF",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `paramountplus://content/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "peacock",
    "name": "Peacock",
    "description": "NBCUniversal's streaming service",
    "icon": "🦚",
    "websiteUrl": "https://peacocktv.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.peacocktv.peacockandroid",
    "androidAppId": "com.peacocktv.peacockandroid",
    "color": "#673AB7",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `peacock://watch/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "moviebase",
    "name": "Moviebase",
    "description": "Track movies & TV shows",
    "icon": "🎭",
    "websiteUrl": "https://moviebase.app",
    "appUrl": "https://play.google.com/store/apps/details?id=com.moviebase",
    "androidAppId": "com.moviebase",
    "color": "#FF6B35",
    "category": "tracking",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `moviebase://movie/${data.tmdbId}`
      },
      {
        "name": "App",
        "url": (data) => `moviebase://imdb/${data.imdbId}`
      }
    ]
  },
  {
    "id": "letterboxd",
    "name": "Letterboxd",
    "description": "Social film discovery",
    "icon": "📝",
    "websiteUrl": "https://letterboxd.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.letterboxd",
    "androidAppId": "com.letterboxd",
    "color": "#00D735",
    "category": "social",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `letterboxd://film/tmdb/${data.tmdbId}`
      },
      {
        "name": "App",
        "url": (data) => `letterboxd://film/${data.imdbId}`
      }
    ]
  },
  {
    "id": "trakt",
    "name": "Trakt",
    "description": "Track what you watch",
    "icon": "📊",
    "websiteUrl": "https://trakt.tv",
    "appUrl": "https://play.google.com/store/apps/details?id=tv.trakt.trakt",
    "androidAppId": "tv.trakt.trakt",
    "color": "#ED1C24",
    "category": "tracking",
    "deepLinks": [
      {
        "name": "App - Movie",
        "url": (data) => `trakt://movie/${data.tmdbId}`
      },
      {
        "name": "App - Search",
        "url": (data) => `trakt://search/imdb/${data.imdbId}`
      },
      {
        "name": "App - TV Show",
        "url": (data) => `trakt://search/tvshow/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://trakt.tv/movies/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "justwatch",
    "name": "JustWatch",
    "description": "Find where to watch movies",
    "icon": "🔍",
    "websiteUrl": "https://justwatch.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.justwatch.justwatch",
    "androidAppId": "com.justwatch.justwatch",
    "color": "#FFD23F",
    "category": "discovery",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `justwatch://title/movie/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "imdb",
    "name": "IMDb",
    "description": "Movie database & ratings",
    "icon": "⭐",
    "websiteUrl": "https://imdb.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.imdb.mobile",
    "androidAppId": "com.imdb.mobile",
    "color": "#F5C518",
    "category": "database",
    "deepLinks": [
      {
        "name": "App - Movie",
        "url": (data) => `imdb:///title/${data.imdbId}`
      },
      {
        "name": "App - TV Show",
        "url": (data) => `imdb:///find?q=${data.tmdbId}`
      }
    ]
  },

  {
    "id": "wikidata",
    "name": "Wikidata",
    "description": "Structured knowledge base",
    "icon": "📚",
    "websiteUrl": "https://wikidata.org",
    "appUrl": "https://wikidata.org",
    "androidAppId": "",
    "color": "#006699",
    "category": "database",
    "deepLinks": [
      {
        "name": "Website",
        "enabled": (data) => !!data.wikidataId,
        "url": (data) => `https://wikidata.org/wiki/${data.wikidataId}`
      }
    ]
  },
  {
    "id": "plex",
    "name": "Plex",
    "description": "Personal media streaming",
    "icon": "🎞️",
    "websiteUrl": "https://plex.tv",
    "appUrl": "https://play.google.com/store/apps/details?id=com.plexapp.android",
    "androidAppId": "com.plexapp.android",
    "color": "#E5A00D",
    "category": "media_center",
    "deepLinks": [
      {
        "name": "App - Movie",
        "url": (data) => `plex://movie/${data.tmdbId}`
      },
      {
        "name": "App - TV Show",
        "url": (data) => `plex://tvshow/${data.tmdbId}`
      },
      {
        "name": "App - Search",
        "url": (data) => `plex://search?query=${data.tmdbId}`
      }
    ]
  },
  {
    "id": "jellyfin",
    "name": "Jellyfin",
    "description": "Free media server",
    "icon": "🟣",
    "websiteUrl": "https://jellyfin.org",
    "appUrl": "https://play.google.com/store/apps/details?id=org.jellyfin.mobile",
    "androidAppId": "org.jellyfin.mobile",
    "color": "#00A4DC",
    "category": "media_center",
    "deepLinks": [
      {
        "name": "App - Movie",
        "url": (data) => `jellyfin://movie/${data.tmdbId}`
      },
      {
        "name": "App - TV Show",
        "url": (data) => `jellyfin://tvshow/${data.tmdbId}`
      },
      {
        "name": "App - Search",
        "url": (data) => `jellyfin://search?query=${data.tmdbId}`
      }
    ]
  },
  {
    "id": "kodi",
    "name": "Kodi",
    "description": "Open source media center",
    "icon": "📱",
    "websiteUrl": "https://kodi.tv",
    "appUrl": "https://play.google.com/store/apps/details?id=org.xbmc.kodi",
    "androidAppId": "org.xbmc.kodi",
    "color": "#17B2E7",
    "category": "media_center",
    "deepLinks": [
      {
        "name": "App - Movie",
        "url": (data) => `kodi://movie/${data.tmdbId}`
      },
      {
        "name": "App - TV Show",
        "url": (data) => `kodi://tvshow/${data.tmdbId}`
      },
      {
        "name": "App - Search",
        "url": (data) => `kodi://search?query=${data.tmdbId}`
      }
    ]
  },
  {
    "id": "ava_assistant",
    "name": "AVA Assistant",
    "description": "AI movie recommendations",
    "icon": "🤖",
    "websiteUrl": "https://ava-assistant.app",
    "appUrl": "https://play.google.com/store/apps/details?id=de.ava",
    "androidAppId": "de.ava",
    "color": "#9C27B0",
    "category": "discovery",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `https://ava-assistant.app/movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `https://ava-assistant.app/series/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "cinemabox",
    "name": "CinemaBox",
    "description": "Movie collection manager",
    "icon": "📦",
    "websiteUrl": "https://cinemabox.app",
    "appUrl": "https://play.google.com/store/apps/details?id=com.cinemabox",
    "androidAppId": "com.cinemabox",
    "color": "#FF5722",
    "category": "tracking",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `cinemabox://movie/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "tv_time",
    "name": "TV Time",
    "description": "Track TV shows & movies",
    "icon": "⏰",
    "websiteUrl": "https://tvtime.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.tozelabs.tvshowtime",
    "androidAppId": "com.tozelabs.tvshowtime",
    "color": "#FF6B6B",
    "category": "tracking",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `tvtime://movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `tvtime://show/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.tvtime.com/en/show/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "youtube",
    "name": "YouTube",
    "description": "Video platform",
    "icon": "▶️",
    "websiteUrl": "https://www.youtube.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    "androidAppId": "com.google.android.youtube",
    "color": "#FF0000",
    "category": "streaming",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "Search in App - Movie",
        "url": (data) => `vnd.youtube://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "Search in App - TV Show",
        "url": (data) => `vnd.youtube://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.youtube.com/results?search_query=${encodeURIComponent(data.title || '')}`
      }
    ]
  },
  {
    "id": "mubi",
    "name": "MUBI",
    "description": "Curated streaming service for independent films",
    "icon": "🎞️",
    "websiteUrl": "https://mubi.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.mubi",
    "androidAppId": "com.mubi",
    "color": "#FF4B3E",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "App",
        "url": (data) => `mubi://films/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://mubi.com/films/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "criterion_channel",
    "name": "Criterion Channel",
    "description": "Classic and contemporary films",
    "icon": "🎭",
    "websiteUrl": "https://www.criterionchannel.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.criterionchannel.android",
    "androidAppId": "com.criterionchannel.android",
    "color": "#1133AA",
    "category": "streaming",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "Search in App - Movie",
        "url": (data) => `vnd.youtube://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "Search in App - TV Show",
        "url": (data) => `vnd.youtube://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.criterionchannel.com/search?q=${encodeURIComponent(data.title || '')}`
      }
    ]
  },
  {
    "id": "kinopoisk",
    "name": "Kinopoisk",
    "description": "Russian movie database and streaming",
    "icon": "🎬",
    "websiteUrl": "https://www.kinopoisk.ru",
    "appUrl": "https://play.google.com/store/apps/details?id=ru.kinopoisk",
    "androidAppId": "ru.kinopoisk",
    "color": "#FF9A00",
    "category": "database",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `kp://film/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `kp://serial/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.kinopoisk.ru/film/${data.tmdbId}/`
      }
    ]
  },
  {
    "id": "simkl",
    "name": "SIMKL",
    "description": "Movie & TV show tracker",
    "icon": "📊",
    "websiteUrl": "https://simkl.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.simkl",
    "androidAppId": "com.simkl",
    "color": "#2DAF38",
    "category": "tracking",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `simkl://media/movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `simkl://media/tv/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://simkl.com/movies/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "the_movie_database",
    "name": "TMDB",
    "description": "The Movie Database",
    "icon": "🎥",
    "websiteUrl": "https://www.themoviedb.org",
    "appUrl": "https://play.google.com/store/apps/details?id=com.themoviedb",
    "androidAppId": "com.themoviedb",
    "color": "#01B4E4",
    "category": "database",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `tmdb://movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `tmdb://tv/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.themoviedb.org/movie/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "tvdb",
    "name": "TheTVDB",
    "description": "TV show database",
    "icon": "📺",
    "websiteUrl": "https://thetvdb.com",
    "color": "#00B4CC",
    "category": "database",
    appUrl: "https://play.google.com/store/apps/details?id=com.thetvdb",
    androidAppId: "com.thetvdb",
    "deepLinks": [
      {
        "name": "Website",
        "url": (data) => `https://thetvdb.com/movies/${data.title?.toLowerCase().replace(/\s+/g, '-')}`
      }
    ]
  },
  {
    "id": "filmweb",
    "name": "Filmweb",
    "description": "Polish movie database",
    "icon": "🎞️",
    "websiteUrl": "https://www.filmweb.pl",
    "appUrl": "https://play.google.com/store/apps/details?id=pl.filmweb.ffw",
    "androidAppId": "pl.filmweb.ffw",
    "color": "#FF5A00",
    "category": "database",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `filmweb://film/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `filmweb://serial/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.filmweb.pl/film/${data.tmdbId}`
      }
    ]
  },
  {
    "id": "allocine",
    "name": "AlloCiné",
    "description": "French movie database",
    "icon": "🎭",
    "websiteUrl": "https://www.allocine.fr",
    "appUrl": "https://play.google.com/store/apps/details?id=com.allocine.app",
    "androidAppId": "com.allocine.app",
    "color": "#FFCC00",
    "category": "database",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `allocine://film/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `allocine://series/${data.tmdbId}`
      },
    ]
  },
  {
    "id": "betaseries",
    "name": "BetaSeries",
    "description": "TV show tracking",
    "icon": "📺",
    "websiteUrl": "https://www.betaseries.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.betaseries.iliad",
    "androidAppId": "com.betaseries.iliad",
    "color": "#00A4DC",
    "category": "tracking",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `betaseries://movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `betaseries://shows/${data.tmdbId}`
      },
      {
        "name": "Website",
        "url": (data) => `https://www.betaseries.com/movie/${data.title?.toLowerCase().replace(/\s+/g, '-')}`
      }
    ]
  },
  {
    "id": "dubbingbase",
    "name": "DubbingBase",
    "description": "Voice actors database",
    "icon": "🎬",
    "websiteUrl": "https://dubbingbase.com",
    "appUrl": "https://play.google.com/store/apps/details?id=xyz.armaldio.dubbingbase.app",
    "androidAppId": "com.dubbingbase.app",
    "color": "#FFCC00",
    "category": "database",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "App - Movie",
        "url": (data) => `dubbingbase://movie/${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "App - TV Show",
        "url": (data) => `dubbingbase://show/${data.tmdbId}`
      },
    ]
  },
  {
    "id": "nzb360",
    "name": "nzb360",
    "description": "All-in-one download manager for your favorite services",
    "icon": "📱",
    "websiteUrl": "https://nzb360.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.kevinforeman.nzb360",
    "androidAppId": "com.kevinforeman.nzb360",
    "color": "#4CAF50",
    "category": "tracking",
    "deepLinks": [
      {
        "enabled": (data) => data.type === 'movie',
        "name": "Add Movie",
        "url": (data) => `nzb360://radarr?movieId=${data.tmdbId}`
      },
      {
        "enabled": (data) => data.type === 'tv',
        "name": "Add TV Show",
        "url": (data) => `nzb360://sonarr?seriesId=${data.tmdbId}`
      },
      {
        "name": "Open App",
        "url": () => `nzb360://dashboard`
      }
    ]
  }
] satisfies Service[]