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
        "url": (data: any) => `netflix://title/${data.tmdb_id}`
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
        "url": (data: any) => `aiv://aiv/resume?asin=${data.imdb_id}`
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
        "url": (data: any) => `disneyplus://content/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.disneyplus.com/movies//${data.tmdb_id}`
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
        "url": (data: any) => `hulu://watch/${data.tmdb_id}`
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
        "url": (data: any) => `hbonow://content/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://play.max.com/movie/${data.tmdb_id}`
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
        "url": (data: any) => `https://tv.apple.com/movie/${data.tmdb_id}`
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
        "url": (data: any) => `paramountplus://content/${data.tmdb_id}`
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
        "url": (data: any) => `peacock://watch/${data.tmdb_id}`
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
        "url": (data: any) => `moviebase://movie/${data.tmdb_id}`
      },
      {
        "name": "App",
        "url": (data: any) => `moviebase://imdb/${data.imdb_id}`
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
        "url": (data: any) => `letterboxd://film/tmdb/${data.tmdb_id}`
      },
      {
        "name": "App",
        "url": (data: any) => `letterboxd://film/${data.imdb_id}`
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
        "name": "App",
        "url": (data: any) => `trakt://movie/${data.tmdb_id}`
      },
      {
        "name": "App",
        "url": (data: any) => `trakt://search/imdb/${data.imdb_id}`
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
        "url": (data: any) => `justwatch://title/movie/${data.tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `imdb:///title/${data.imdb_id}`
      },
      {
        "name": "App",
        "url": (data: any) => `imdb:///find?q=${data.tmdb_id}`
      }
    ]
  },
  {
    "id": "tmdb",
    "name": "TMDB",
    "description": "The Movie Database",
    "icon": "🎬",
    "websiteUrl": "https://themoviedb.org",
    "appUrl": "https://play.google.com/store/apps/details?id=com.tmdb.mobile",
    "androidAppId": "com.tmdb.mobile",
    "color": "#01B4E4",
    "category": "database",
    "deepLinks": [
      {
        "name": "App",
        "url": (data: any) => `tmdb://movie/${data.tmdb_id}`
      }
    ]
  },
  {
    "id": "tvdb",
    "name": "TheTVDB",
    "description": "TV series database",
    "icon": "📺",
    "websiteUrl": "https://thetvdb.com",
    "appUrl": "https://thetvdb.com",
    "androidAppId": "",
    "color": "#4CAF50",
    "category": "database",
    "deepLinks": [
      {
        "name": "Website",
        "url": (data: any) => `https://thetvdb.com/series/${data.tvdb_id}`
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
        "url": (data: any) => `https://wikidata.org/wiki/${data.wikidata_id}`
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
        "name": "App",
        "url": (data: any) => `plex://movie/${data.tmdb_id}`
      },
      {
        "name": "App",
        "url": (data: any) => `plex://search?query=${data.imdb_id}`
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
        "name": "App",
        "url": (data: any) => `jellyfin://movie/${data.tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `kodi://movie/${data.tmdb_id}`
      }
    ]
  },
  {
    "id": "youtube",
    "name": "YouTube",
    "description": "Video platform",
    "icon": "📹",
    "websiteUrl": "https://youtube.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    "androidAppId": "com.google.android.youtube",
    "color": "#FF0000",
    "category": "discovery",
    "deepLinks": [
      {
        "name": "App",
        "url": (data: any) => `youtube://search?query=${data.tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `https://ava-assistant.app/{type}/{tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `cinemabox://movie/${data.tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `tvtime://show/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.tvtime.com/en/show/${data.tmdb_id}`
      }
    ]
  },
  {
    "id": "youtube_movies",
    "name": "YouTube Movies",
    "description": "Rent or buy movies and shows",
    "icon": "▶️",
    "websiteUrl": "https://www.youtube.com/movies",
    "appUrl": "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    "androidAppId": "com.google.android.youtube",
    "color": "#FF0000",
    "category": "streaming",
    "deepLinks": [
      {
        "name": "Search in App",
        "url": (data: any) => `vnd.youtube://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.youtube.com/results?search_query=${encodeURIComponent(data.title || '')}`
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
        "url": (data: any) => `mubi://films/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://mubi.com/films/${data.tmdb_id}`
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
        "name": "Website",
        "url": (data: any) => `https://www.criterionchannel.com/search?q=${encodeURIComponent(data.title || '')}`
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
        "name": "App",
        "url": (data: any) => `kp://film/${data.kinopoisk_id || data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.kinopoisk.ru/film/${data.kinopoisk_id || data.tmdb_id}/`
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
        "name": "App",
        "url": (data: any) => `simkl://media/movie/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://simkl.com/movies/${data.tmdb_id}`
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
        "name": "App",
        "url": (data: any) => `tmdb://movie/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.themoviedb.org/movie/${data.tmdb_id}`
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
        "url": (data: any) => `https://thetvdb.com/movies/${data.tvdb_id || data.title?.toLowerCase().replace(/\s+/g, '-')}`
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
        "name": "App",
        "url": (data: any) => `filmweb://film/${data.filmweb_id || data.title?.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.filmweb.pl/film/${data.filmweb_id || data.title?.toLowerCase().replace(/\s+/g, '-')}`
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
        "name": "App",
        "url": (data: any) => `allocine://film/${data.allocine_id || data.tmdb_id}/`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.allocine.fr/film/fichefilm_gen_cfilm=${data.allocine_id || data.tmdb_id}.html`
      }
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
        "name": "App",
        "url": (data: any) => `betaseries://shows/${data.betaseries_id || data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://www.betaseries.com/movie/${data.title?.toLowerCase().replace(/\s+/g, '-')}`
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
    "androidAppId": "xyz.armaldio.dubbingbase.app",
    "color": "#FFCC00",
    "category": "database",
    "deepLinks": [
      {
        "name": "App",
        "url": (data: any) => `dubbingbase://movie/${data.tmdb_id}`
      },
      {
        "name": "Website",
        "url": (data: any) => `https://dubbingbase.com/movie/${data.tmdb_id}`
      }
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
        "name": "Search",
        "url": (data: any) => `nzb360://search?query=${encodeURIComponent(data.title || '')}`
      },
      {
        "name": "Open App",
        "url": () => `nzb360://dashboard`
      }
    ]
  }
] satisfies Service[]