import dubbingbaseIcon from "../../assets/apps/images/dubbingbase/assets/play_store.png";
import { Service } from "../../types/index";

export const dubbingbase: Service = {
  id: "dubbingbase",
  name: "DubbingBase",
  description: "Voice actors database",
  icon: dubbingbaseIcon,
  websiteUrl: "https://dubbingbase.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.dubbingbase.app",
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
};