import { Service } from "../types/index.ts";
import { FormattedDetails } from "../models/models";

import netflixIcon from "../assets/apps/images/netflix/assets/play_store.png";
import primeVideoIcon from "../assets/apps/images/prime_video/assets/play_store.png";
import disneyPlusIcon from "../assets/apps/images/disney_plus/assets/play_store.png";
import huluIcon from "../assets/apps/images/hulu/assets/play_store.png";
import maxIcon from "../assets/apps/images/max/assets/play_store.png";
import appleTvPlusIcon from "../assets/apps/images/apple_tv_plus/assets/play_store.png";
import paramountPlusIcon from "../assets/apps/images/paramount_plus/assets/play_store.png";
import peacockIcon from "../assets/apps/images/peacock/assets/play_store.png";
import moviebaseIcon from "../assets/apps/images/moviebase/assets/play_store.png";
import letterboxdIcon from "../assets/apps/images/letterboxd/assets/play_store.png";
import traktIcon from "../assets/apps/images/trakt/assets/play_store.png";
import justWatchIcon from "../assets/apps/images/justwatch/assets/play_store.png";
import imdbIcon from "../assets/apps/images/imdb/assets/play_store.png";
import wikidataIcon from "../assets/apps/images/wikidata/assets/play_store.png";
import plexIcon from "../assets/apps/images/plex/assets/play_store.png";
import betaseriesIcon from "../assets/apps/images/betaseries/assets/play_store.png";
import tvTimeIcon from "../assets/apps/images/tv_time/assets/play_store.png";
import jellyfinIcon from "../assets/apps/images/jellyfin/assets/play_store.png";
import kodiIcon from "../assets/apps/images/kodi/assets/play_store.png";
import avaAssistantIcon from "../assets/apps/images/ava_assistant/assets/play_store.png";
import youtubeIcon from "../assets/apps/images/youtube/assets/play_store.png";
import mubiIcon from "../assets/apps/images/mubi/assets/play_store.png";
import simklIcon from "../assets/apps/images/simkl/assets/play_store.png";
import tmdbIcon from "../assets/apps/images/the_movie_database/assets/favicon.png";
import tvdbIcon from "../assets/apps/images/tvdb/assets/favicon.png";
import allocineIcon from "../assets/apps/images/allocine/assets/play_store.png";
import dubbingbaseIcon from "../assets/apps/images/dubbingbase/assets/play_store.png";
import nzb360Icon from "../assets/apps/images/nzb360/assets/play_store.png";
import { useTVDBStore } from "../stores/tvdb";

// Function to fetch TVDB data and enhance FormattedDetails
export const fetchTVDBData = async (
  formattedDetails: FormattedDetails
): Promise<FormattedDetails> => {
  if (!formattedDetails.tvdbId) {
    console.log("No TVDB ID available, returning original details");
    return formattedDetails;
  }

  console.log(
    `Fetching TVDB data for ${formattedDetails.type} with ID: ${formattedDetails.tvdbId}`
  );

  const tvdbStore = useTVDBStore();

  try {
    let details: any = null;

    if (formattedDetails.type === "tv") {
      console.log("Fetching series images from TVDB");
      console.log("Fetching series details from TVDB");
      details = await tvdbStore.getSeriesDetails(formattedDetails.tvdbId);
    } else if (formattedDetails.type === "movie") {
      console.log("Fetching movie images from TVDB");
      console.log("Fetching movie details from TVDB");
      details = await tvdbStore.getMovieDetails(formattedDetails.tvdbId);
    }

    // Enhance the formatted details with TVDB data
    const enhancedDetails = { ...formattedDetails };

    if (details && details.slug) {
      enhancedDetails.tvdbSlug = details.slug;
      console.log("Added TVDB slug to enhanced details");
    }

    console.log("Returning enhanced details with TVDB data");
    return enhancedDetails;
  } catch (error) {
    console.error("Error fetching TVDB data:", error);
  }

  console.log("Returning original details due to error or no data");
  return formattedDetails;
};

export default [
  {
    id: "netflix",
    name: "Netflix",
    description: "Stream movies and TV shows",
    icon: netflixIcon,
    websiteUrl: "https://netflix.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    androidAppId: "com.netflix.mediaclient",
    color: "#E50914",
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data) => `netflix://title/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "prime_video",
    name: "Prime Video",
    description: "Amazon's streaming service",
    icon: primeVideoIcon,
    websiteUrl: "https://primevideo.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient",
    androidAppId: "com.amazon.avod.thirdpartyclient",
    color: "#00A8E1",
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data) => `aiv://aiv/resume?asin=${data.tmdbId}`,
      },
    ],
  },
  {
    id: "disney_plus",
    name: "Disney+",
    description: "Stream Disney, Pixar, Marvel, Star Wars, and more",
    icon: disneyPlusIcon,
    websiteUrl: "https://www.disneyplus.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
    androidAppId: "com.disney.disneyplus",
    color: "#113CCF",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `disneyplus://content/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `disneyplus://content/${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `https://www.disneyplus.com/movies//${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `https://www.disneyplus.com/movies//${data.tmdbId}`,
      },
    ],
  },
  {
    id: "hulu",
    name: "Hulu",
    description: "Stream current shows and movies",
    icon: huluIcon,
    websiteUrl: "https://hulu.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.hulu.plus",
    androidAppId: "com.hulu.plus",
    color: "#1CE783",
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data) => `hulu://watch/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "max",
    name: "Max",
    description: "Stream HBO, Warner Bros, DC, and more",
    icon: maxIcon,
    websiteUrl: "https://www.max.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.wbd.stream",
    androidAppId: "com.wbd.stream",
    color: "#8B00FF",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `max://content/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `max://content/${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `https://play.max.com/movie/${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `https://play.max.com/movie/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "apple_tv_plus",
    name: "Apple TV+",
    description: "Apple Original shows and movies",
    icon: appleTvPlusIcon,
    websiteUrl: "https://tv.apple.com",
    appUrl: "https://apps.apple.com/app/apple-tv/id1174078549",
    androidAppId: "com.apple.atve.sony.appletv",
    color: "#000000",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `https://tv.apple.com/movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `https://tv.apple.com/movie/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "paramount_plus",
    name: "Paramount+",
    description: "CBS, Nickelodeon & more",
    icon: paramountPlusIcon,
    websiteUrl: "https://paramountplus.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.cbs.app",
    androidAppId: "com.cbs.app",
    color: "#0064FF",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `paramountplus://content/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `paramountplus://content/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "peacock",
    name: "Peacock",
    description: "NBCUniversal's streaming service",
    icon: peacockIcon,
    websiteUrl: "https://peacocktv.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.peacocktv.peacockandroid",
    androidAppId: "com.peacocktv.peacockandroid",
    color: "#673AB7",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `peacock://watch/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `peacock://watch/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "moviebase",
    name: "Moviebase",
    description: "Track movies & TV shows",
    icon: moviebaseIcon,
    websiteUrl: "https://moviebase.app",
    appUrl: "https://play.google.com/store/apps/details?id=com.moviebase",
    androidAppId: "com.moviebase",
    color: "#FF6B35",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `moviebase://movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `moviebase://imdb/${data.imdbId}`,
      },
    ],
  },
  {
    id: "letterboxd",
    name: "Letterboxd",
    description: "Social film discovery",
    icon: letterboxdIcon,
    websiteUrl: "https://letterboxd.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.letterboxd",
    androidAppId: "com.letterboxd.letterboxd",
    color: "#00D735",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `letterboxd://film/tmdb/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `letterboxd://film/${data.imdbId}`,
      },
    ],
  },
  {
    id: "trakt",
    name: "Trakt",
    description: "Track what you watch",
    icon: traktIcon,
    websiteUrl: "https://trakt.tv",
    appUrl: "https://play.google.com/store/apps/details?id=tv.trakt.trakt",
    androidAppId: "tv.trakt.trakt",
    color: "#ED1C24",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `trakt://movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `trakt://search/tvshow/${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `https://trakt.tv/movies/${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `https://trakt.tv/shows/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "justwatch",
    name: "JustWatch",
    description: "Find where to watch movies",
    icon: justWatchIcon,
    websiteUrl: "https://justwatch.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.justwatch.justwatch",
    androidAppId: "com.justwatch.justwatch",
    color: "#FFD23F",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `justwatch://title/movie/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "imdb",
    name: "IMDb",
    description: "Movie database & ratings",
    icon: imdbIcon,
    websiteUrl: "https://imdb.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.imdb.mobile",
    androidAppId: "com.imdb.mobile",
    color: "#F5C518",
    deepLinks: [
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `imdb:///title/${data.imdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `imdb:///find?q=${data.tmdbId}`,
      },
      {
        name: "Website",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `https://imdb.com/title/${data.imdbId}`,
      },
      {
        name: "Website",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `https://imdb.com/title/${data.imdbId}`,
      },
    ],
  },

  {
    id: "wikidata",
    name: "Wikidata",
    description: "Structured knowledge base",
    icon: wikidataIcon,
    websiteUrl: "https://wikidata.org",
    appUrl: "https://play.google.com/store/apps/details?id=org.wikipedia",
    androidAppId: "org.wikipedia",
    color: "#006699",
    deepLinks: [
      {
        name: "Wikidata website",
        mediaType: "all",
        enabled: (data) => !!data.wikidataId,
        url: (data) => `https://wikidata.org/wiki/${data.wikidataId}`,
      },
      {
        name: "Wikidata app",
        mediaType: "all",
        enabled: (data) => !!data.wikidataId,
        url: (data) => `wikidata://entity/${data.wikidataId}`,
      },
      {
        name: "Wikipedia page",
        mediaType: "all",
        enabled: (data) => !!data.wikidataId,
        url: async (data) => {
          if (!data.wikidataId) return "";
          try {
            // First, get the Wikipedia page title from Wikidata
            const response = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${data.wikidataId}&props=sitelinks&format=json&origin=*`
            );
            const result = await response.json();

            // Get the English Wikipedia page title if available
            const pageTitle =
              result.entities[data.wikidataId]?.sitelinks?.enwiki?.title;

            if (pageTitle) {
              return `https://en.wikipedia.org/wiki/${encodeURIComponent(
                pageTitle.replace(/ /g, "_")
              )}`;
            }

            // Fallback to direct Wikidata ID if no page title found
            return `https://www.wikidata.org/wiki/${data.wikidataId}`;
          } catch (error) {
            console.error("Error fetching Wikipedia page:", error);
            // Fallback to direct Wikidata link on error
            return `https://www.wikidata.org/wiki/${data.wikidataId}`;
          }
        },
      },
    ],
  },
  {
    id: "plex",
    name: "Plex",
    description: "Stream your media library",
    icon: plexIcon,
    websiteUrl: "https://plex.tv",
    appUrl: "https://play.google.com/store/apps/details?id=com.plexapp.android",
    androidAppId: "com.plexapp.android",
    color: "#e5a00d",
    supportsCustomInstances: true,
    customInstances: [],
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data, instance) => {
          if (instance) {
            return `${instance.baseUrl}/web/index.html`;
          }
          return `plex://preferences`;
        },
        customUrlBuilder: (data, instance) => {
          return `${instance.baseUrl}/web/index.html`;
        },
      },
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `plex://movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `plex://tvshow/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        url: (data) => `plex://search?query=${data.tmdbId}`,
      },
    ],
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    description: "Open source media system",
    icon: jellyfinIcon,
    websiteUrl: "https://jellyfin.org",
    appUrl: "https://play.google.com/store/apps/details?id=org.jellyfin.mobile",
    androidAppId: "org.jellyfin.mobile",
    color: "#00A4DC",
    supportsCustomInstances: true,
    customInstances: [],
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data, instance) => {
          if (instance) {
            return instance.baseUrl;
          }
          return `jellyfin://`;
        },
        customUrlBuilder: (data, instance) => {
          return instance.baseUrl;
        },
      },
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `jellyfin://movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `jellyfin://tvshow/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        url: (data) => `jellyfin://search?query=${data.tmdbId}`,
      },
    ],
  },
  {
    id: "kodi",
    name: "Kodi",
    description: "Open source media center",
    icon: kodiIcon,
    websiteUrl: "https://kodi.tv",
    appUrl: "https://play.google.com/store/apps/details?id=org.xbmc.kodi",
    androidAppId: "org.xbmc.kodi",
    color: "#17B2E7",
    supportsCustomInstances: true,
    customInstances: [],
    deepLinks: [
      {
        name: "App",
        mediaType: "all",
        url: (data, instance) => {
          if (instance) {
            return `kodi://${instance.baseUrl}`;
          }
          return `kodi://`;
        },
        customUrlBuilder: (data, instance) => {
          return `http://${instance.baseUrl}`;
        },
      },
      {
        name: "App",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data) => `kodi://movie/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data) => `kodi://tvshow/${data.tmdbId}`,
      },
      {
        name: "App",
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        url: (data) => `kodi://search?query=${data.tmdbId}`,
      },
    ],
  },
  {
    id: "ava_assistant",
    name: "AVA Assistant",
    description: "AI movie recommendations",
    icon: avaAssistantIcon,
    websiteUrl: "https://ava-assistant.app",
    appUrl: "https://play.google.com/store/apps/details?id=de.ava",
    androidAppId: "de.ava",
    color: "#9C27B0",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => {
          const url = `https://ava-assistant.app/movie/${data.tmdbId}`;
          console.log("url", url);
          return url;
        },
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => {
          console.log(data);
          const url = `https://ava-assistant.app/show/?id=${data.tmdbId}`;
          console.log("url", url);
          return url;
        },
      },
    ],
  },
  {
    id: "tv_time",
    name: "TV Time",
    description: "Track TV shows & movies",
    icon: tvTimeIcon,
    websiteUrl: "https://tvtime.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.tozelabs.tvshowtime",
    androidAppId: "com.tozelabs.tvshowtime",
    color: "#FF6B6B",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `tvtime://movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `tvtime://show/${data.tmdbId}`,
      },
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) => `https://www.tvtime.com/en/movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Website",
        url: (data) => `https://www.tvtime.com/en/show/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Video platform",
    icon: youtubeIcon,
    websiteUrl: "https://www.youtube.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    androidAppId: "com.google.android.youtube",
    color: "#FF0000",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Search in App",
        url: (data) =>
          `vnd.youtube://search?query=${encodeURIComponent(data.title || "")}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Search in App",
        url: (data) =>
          `vnd.youtube://search?query=${encodeURIComponent(data.title || "")}`,
      },
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) =>
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            data.title || ""
          )}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Website",
        url: (data) =>
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            data.title || ""
          )}`,
      },
    ],
  },
  {
    id: "mubi",
    name: "MUBI",
    description: "Curated streaming service for independent films",
    icon: mubiIcon,
    websiteUrl: "https://mubi.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.mubi",
    androidAppId: "com.mubi",
    color: "#FF4B3E",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `mubi://films/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `mubi://films/${data.tmdbId}`,
      },
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) => `https://mubi.com/films/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "simkl",
    name: "SIMKL",
    description: "Movie &  tracker",
    icon: simklIcon,
    websiteUrl: "https://simkl.com",
    appUrl: "https://play.google.com/store/apps/details?id=com.simkl.lists",
    androidAppId: "com.simkl.lists",
    color: "#2DAF38",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `simkl://media/movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `simkl://media/tv/${data.tmdbId}`,
      },
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) => `https://simkl.com/movies/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Website",
        url: (data) => `https://simkl.com/tv-shows/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "the_movie_database",
    name: "TMDB",
    description: "The Movie Database",
    icon: tmdbIcon,
    websiteUrl: "https://www.themoviedb.org",
    appUrl: "https://www.themoviedb.org",
    androidAppId: "",
    color: "#01B4E4",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) => `https://www.themoviedb.org/movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Website",
        url: (data) => `https://www.themoviedb.org/tv/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "tvdb",
    name: "TheTVDB",
    description: "TV show database",
    icon: tvdbIcon,
    websiteUrl: "https://thetvdb.com",
    color: "#00B4CC",
    appUrl: "https://thetvdb.com",
    androidAppId: "",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie" && !!data.tvdbSlug,
        name: "Website",
        url: (data) => `https://thetvdb.com/movies/${data.tvdbSlug}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv" && !!data.tvdbSlug,
        name: "Website",
        url: (data) => `https://thetvdb.com/series/${data.tvdbSlug}`,
      },
    ],
  },
  {
    id: "allocine",
    name: "AlloCiné",
    description: "French movie database",
    icon: allocineIcon,
    websiteUrl: "https://www.allocine.fr",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.allocine.androidapp",
    androidAppId: "com.allocine.androidapp",
    color: "#FFCC00",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `allocine://film/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `allocine://series/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "betaseries",
    name: "BetaSeries",
    description: "TV show tracking",
    icon: betaseriesIcon,
    websiteUrl: "https://www.betaseries.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.betaseriesnative",
    androidAppId: "com.betaseriesnative",
    color: "#00A4DC",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `betaseries://movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `betaseries://shows/${data.tmdbId}`,
      },
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Website",
        url: (data) =>
          `https://www.betaseries.com/movie/${data.title
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Website",
        url: (data) =>
          `https://www.betaseries.com/serie/${data.title
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`,
      },
    ],
  },
  {
    id: "dubbingbase",
    name: "DubbingBase",
    description: "Voice actors database",
    icon: dubbingbaseIcon,
    websiteUrl: "https://dubbingbase.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=xyz.armaldio.dubbingbase.app",
    androidAppId: "com.dubbingbase.app",
    color: "#FFCC00",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "App",
        url: (data) => `dubbingbase://movie/${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "App",
        url: (data) => `dubbingbase://show/${data.tmdbId}`,
      },
    ],
  },
  {
    id: "nzb360",
    name: "nzb360",
    description: "All-in-one download manager for your favorite services",
    icon: nzb360Icon,
    websiteUrl: "https://nzb360.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.kevinforeman.nzb360",
    androidAppId: "com.kevinforeman.nzb360",
    color: "#4CAF50",
    deepLinks: [
      {
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        name: "Add Movie",
        url: (data) => `nzb360://radarr?movieId=${data.tmdbId}`,
      },
      {
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        name: "Add to app",
        url: (data) => `nzb360://sonarr?seriesId=${data.tmdbId}`,
      },
      {
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        name: "Open App",
        url: (data) =>
          `nzb360://search?query=${encodeURIComponent(data.title || "")}`,
      },
    ],
  },
] satisfies Service[];
