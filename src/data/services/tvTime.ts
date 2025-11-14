import tvTimeIcon from "../../assets/apps/images/tv_time/assets/play_store.png";
import { Service } from "../../types/index";

export const tvTime: Service = {
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
};