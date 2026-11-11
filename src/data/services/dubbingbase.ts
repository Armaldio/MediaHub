import dubbingbaseIcon from "../../assets/apps/images/dubbingbase/assets/play_store.png";
import { Service } from "../../types/index";

export const dubbingbase: Service = {
  id: "dubbingbase",
  name: "DubbingBase",
  description: "Voice actors database",
  icon: dubbingbaseIcon,
  websiteUrl: "https://dubbingbase.com",
  appUrl: "https://dubbingbase.com",
  androidAppId: "",
  color: "#FFCC00",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Web",
      url: (data) => `https://dubbingbase.com/movie/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Web",
      url: (data) => `https://dubbingbase.com/show/${data.tmdbId}`,
    },
  ],
};
