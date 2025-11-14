import paramountPlusIcon from "../../assets/apps/images/paramount_plus/assets/play_store.png";
import { Service } from "../../types/index";

export const paramountPlus: Service = {
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
      url: (data) =>
        `paramountplus://content/${data.paramountPlusId || data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) =>
        `paramountplus://content/${data.paramountPlusId || data.tmdbId}`,
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.paramountPlusId,
      url: (data) =>
        `https://www.paramountplus.com/movies/video/${data.paramountPlusId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.paramountPlusId,
      url: (data) =>
        `https://www.paramountplus.com/shows/video/${data.paramountPlusId}`,
    },
  ],
};