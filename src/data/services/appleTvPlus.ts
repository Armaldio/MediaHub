import appleTvPlusIcon from "../../assets/apps/images/apple_tv_plus/assets/play_store.png";
import { Service } from "../../types/index";

export const appleTvPlus: Service = {
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
      enabled: (data) => data.type === "movie" && !!data.appleTvId,
      url: (data) => `apple-tv://movie/${data.appleTvId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.appleTvId,
      url: (data) => `apple-tv://show/${data.appleTvId}`,
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) =>
        `https://tv.apple.com/movie/${data.appleTvId || data.tmdbId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) =>
        `https://tv.apple.com/show/${data.appleTvId || data.tmdbId}`,
    },
  ],
};