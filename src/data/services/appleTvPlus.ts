import appleTvPlusIcon from "../../assets/apps/images/apple_tv_plus/assets/play_store.webp";
import { Service } from "../../types/index";

export const appleTvPlus: Service = {
  id: "apple_tv_plus",
  name: "Apple TV+",
  description: "Apple Original shows and movies",
  icon: appleTvPlusIcon,
  websiteUrl: "https://tv.apple.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.apple.atve.androidtv.appletv",
  androidAppId: "com.apple.atve.androidtv.appletv",
  color: "#000000",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.appleTvId,
      url: (data) => `https://tv.apple.com/movie/${data.appleTvId}`,
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.appleTvId,
      url: (data) => `https://tv.apple.com/show/${data.appleTvId}`,
      requiresApp: true,
    },
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.appleTvId,
      url: (data) => `https://tv.apple.com/movie/${data.appleTvId}`,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.appleTvId,
      url: (data) => `https://tv.apple.com/show/${data.appleTvId}`,
    },
  ],
};
