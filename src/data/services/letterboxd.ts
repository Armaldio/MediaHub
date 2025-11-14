import letterboxdIcon from "../../assets/apps/images/letterboxd/assets/play_store.png";
import { Service } from "../../types/index";

export const letterboxd: Service = {
  id: "letterboxd",
  name: "Letterboxd",
  description: "Social film discovery",
  icon: letterboxdIcon,
  websiteUrl: "https://letterboxd.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.letterboxd",
  androidAppId: "com.letterboxd.letterboxd",
  color: "#00D735",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `letterboxd://film/${data.letterboxdId || data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `letterboxd://film/${data.letterboxdId || data.imdbId}`,
    },
    {
      name: "Website",
      mediaType: "all",
      enabled: (data) => !!data.letterboxdId,
      url: (data) => `https://letterboxd.com/film/${data.letterboxdId}`,
    },
  ],
};