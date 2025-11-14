import jellyfinIcon from "../../assets/apps/images/jellyfin/assets/play_store.png";
import { Service } from "../../types/index";

export const jellyfin: Service = {
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
};