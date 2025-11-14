import allocineIcon from "../../assets/apps/images/allocine/assets/play_store.png";
import { Service } from "../../types/index";

export const allocine: Service = {
  id: "allocine",
  name: "AlloCiné",
  description: "French movie database",
  icon: allocineIcon,
  websiteUrl: "https://www.allocine.fr",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.allocine.androidapp",
  androidAppId: "com.allocine.androidapp",
  color: "#FFCC00",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "App",
      url: (data) => `allocine://film/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "App",
      url: (data) => `allocine://series/${data.tmdbId}`,
    },
  ],
};