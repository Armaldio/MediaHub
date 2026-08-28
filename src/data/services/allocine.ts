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
      enabled: (data) => data.type === "movie" && !!data.allocineId,
      name: "App",
      url: (data) => `allocine://film/${data.allocineId}`,
      requiresApp: true,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.allocineId,
      name: "App",
      url: (data) => `allocine://series/${data.allocineId}`,
      requiresApp: true,
    },
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.allocineId,
      name: "Website",
      url: (data) =>
        `https://www.allocine.fr/film/fichefilm_gen_cfilm=${data.allocineId}.html`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.allocineId,
      name: "Website",
      url: (data) =>
        `https://www.allocine.fr/film/fichefilm_gen_cfilm=${data.allocineId}.html`,
    },
  ],
};