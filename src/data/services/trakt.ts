import traktIcon from "../../assets/apps/images/trakt/assets/play_store.png";
import { Service } from "../../types/index";
import { traktSlug, traktTvUrl } from "./providerUrls";

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
      url: (data) => `trakt://movie/${data.traktSlug || traktSlug(data)}`,
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `trakt://show/${data.traktSlug || traktSlug(data)}`,
      requiresApp: true,
    },
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `https://trakt.tv/movies/${data.traktSlug || traktSlug(data)}`,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: traktTvUrl,
    },
  ],
};
