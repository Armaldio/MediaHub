import traktIcon from "../../assets/apps/images/trakt/assets/play_store.png";
import { Service } from "../../types/index";

export const trakt: Service = {
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
};