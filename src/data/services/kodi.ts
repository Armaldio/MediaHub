import kodiIcon from "../../assets/apps/images/kodi/assets/play_store.png";
import { Service } from "../../types/index";

export const kodi: Service = {
  id: "kodi",
  name: "Kodi",
  description: "Open source media center",
  icon: kodiIcon,
  websiteUrl: "https://kodi.tv",
  appUrl: "https://play.google.com/store/apps/details?id=org.xbmc.kodi",
  androidAppId: "org.xbmc.kodi",
  color: "#17B2E7",
  category: "self-hosted",
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
      enabled: (data) => data.type === "movie" && !!data.tmdbId,
      url: (data, instance) => instance
        ? `http://${instance.baseUrl}/video/${data.tmdbId}`
        : `kodi://movie/${data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.tmdbId,
      url: (data, instance) => instance
        ? `http://${instance.baseUrl}/video/${data.tmdbId}`
        : `kodi://tvshow/${data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "all",
      enabled: (data) => (data.type === "movie" || data.type === "tv") && !!data.tmdbId,
      url: (data) => `kodi://search?query=${data.tmdbId}`,
    },
  ],
};