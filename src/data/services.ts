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
        "type": "tmdb",
        "pattern": "netflix://title/{tmdb_id}"
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
        "type": "imdb",
        "pattern": "aiv://aiv/resume?asin={imdb_id}"
      }
    ]
  },
  {
    "id": "disney_plus",
    "name": "Disney+",
    "description": "Disney, Marvel, Star Wars & more",
    "icon": "🏰",
    "websiteUrl": "https://disneyplus.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
    "androidAppId": "com.disney.disneyplus",
    "color": "#113CCF",
    "category": "streaming",
    "deepLinks": [
      {
        "type": "tmdb",
        "pattern": "disneyplus://content/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "hulu://watch/{tmdb_id}"
      }
    ]
  },
  {
    "id": "hbo_max",
    "name": "HBO Max",
    "description": "Premium HBO content",
    "icon": "👑",
    "websiteUrl": "https://hbomax.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.hbo.hbonow",
    "androidAppId": "com.hbo.hbonow",
    "color": "#673AB7",
    "category": "streaming",
    "deepLinks": [
      {
        "type": "tmdb",
        "pattern": "hbomax://feature/{tmdb_id}"
      }
    ]
  },
  {
    "id": "apple_tv",
    "name": "Apple TV+",
    "description": "Original shows and movies",
    "icon": "🍎",
    "websiteUrl": "https://tv.apple.com",
    "appUrl": "https://play.google.com/store/apps/details?id=com.apple.atve.androidtv.appletv",
    "androidAppId": "com.apple.atve.androidtv.appletv",
    "color": "#000000",
    "category": "streaming",
    "deepLinks": [
      {
        "type": "tmdb",
        "pattern": "com.apple.tv://show/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "paramountplus://content/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "peacock://watch/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "moviebase://movie/{tmdb_id}"
      },
      {
        "type": "imdb",
        "pattern": "moviebase://imdb/{imdb_id}"
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
        "type": "tmdb",
        "pattern": "letterboxd://film/tmdb/{tmdb_id}"
      },
      {
        "type": "imdb",
        "pattern": "letterboxd://film/{imdb_id}"
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
        "type": "tmdb",
        "pattern": "trakt://movie/{tmdb_id}"
      },
      {
        "type": "imdb",
        "pattern": "trakt://search/imdb/{imdb_id}"
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
        "type": "tmdb",
        "pattern": "justwatch://title/movie/{tmdb_id}"
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
        "type": "imdb",
        "pattern": "imdb:///title/{imdb_id}"
      },
      {
        "type": "tmdb",
        "pattern": "imdb:///find?q={tmdb_id}"
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
        "type": "tmdb",
        "pattern": "tmdb://movie/{tmdb_id}"
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
        "type": "tvdb",
        "pattern": "https://thetvdb.com/series/{tvdb_id}"
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
        "type": "wikidata",
        "pattern": "https://wikidata.org/wiki/{wikidata_id}"
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
        "type": "tmdb",
        "pattern": "plex://movie/{tmdb_id}"
      },
      {
        "type": "imdb",
        "pattern": "plex://search?query={imdb_id}"
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
        "type": "tmdb",
        "pattern": "jellyfin://movie/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "kodi://movie/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "youtube://search?query={tmdb_id}"
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
        "type": "tmdb",
        "pattern": "https://ava-assistant.app/{type}/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "cinemabox://movie/{tmdb_id}"
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
        "type": "tmdb",
        "pattern": "tvtime://show/{tmdb_id}"
      }
    ]
  }
]