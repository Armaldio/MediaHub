import disneyPlusIcon from "../../assets/apps/images/disney_plus/assets/play_store.png";
import { Service } from "../../types/index";

export const disneyPlus: Service = {
  id: "disney_plus",
  name: "Disney+",
  description: "Stream Disney, Pixar, Marvel, Star Wars, and more",
  icon: disneyPlusIcon,
  websiteUrl: "https://www.disneyplus.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
  androidAppId: "com.disney.disneyplus",
  color: "#113CCF",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => {
        const id = data.disneyPlusId || data.tmdbId;
        console.log("Disney+ movie deep link ID:", id, "Type:", typeof id);
        return `disneyplus://content/${id}`;
      },
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => {
        const id = data.disneyPlusId || data.tmdbId;
        console.log("Disney+ tv deep link ID:", id, "Type:", typeof id);
        return `disneyplus://content/${id}`;
      },
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) =>
        `https://www.disneyplus.com/movies/wd/${data.disneyPlusId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) =>
        `https://www.disneyplus.com/series/wd/${data.disneyPlusId}`,
    },
  ],
};