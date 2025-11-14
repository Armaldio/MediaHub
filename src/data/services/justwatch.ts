import justWatchIcon from "../../assets/apps/images/justwatch/assets/play_store.png";
import { Service } from "../../types/index";

export const justwatch: Service = {
  id: "justwatch",
  name: "JustWatch",
  description: "Find where to watch movies",
  icon: justWatchIcon,
  websiteUrl: "https://justwatch.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.justwatch.justwatch",
  androidAppId: "com.justwatch.justwatch",
  color: "#FFD23F",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `justwatch://title/movie/${data.tmdbId}`,
    },
  ],
};