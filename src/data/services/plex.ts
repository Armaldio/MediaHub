import plexIcon from "../../assets/apps/images/plex/assets/play_store.png";
import { Service } from "../../types/index";

export const plex: Service = {
  id: "plex",
  name: "Plex",
  description: "Stream your media library",
  icon: plexIcon,
  websiteUrl: "https://plex.tv",
  appUrl: "https://play.google.com/store/apps/details?id=com.plexapp.android",
  androidAppId: "com.plexapp.android",
  color: "#e5a00d",
  category: "self-hosted",
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
      enabled: (data) => data.type === "movie" && !!data.tmdbId,
      url: (data, instance) => instance
        ? `${instance.baseUrl}/web/index.html#!/library/metadata/${data.tmdbId}`
        : `plex://movie/${data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.tmdbId,
      url: (data, instance) => instance
        ? `${instance.baseUrl}/web/index.html#!/library/metadata/${data.tmdbId}`
        : `plex://tvshow/${data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "all",
      enabled: (data) => (data.type === "movie" || data.type === "tv") && !!data.tmdbId,
      url: (data) => `plex://search?query=${data.tmdbId}`,
    },
  ],
};