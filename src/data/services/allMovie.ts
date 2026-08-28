import allMovieIcon from "../../assets/apps/images/allmovie/assets/logo.svg";
import { Service } from "../../types/index";

export const allMovie: Service = {
  id: "allmovie",
  name: "AllMovie",
  description: "Movie database & discovery",
  icon: allMovieIcon,
  websiteUrl: "https://www.allmovie.com",
  appUrl: "https://www.allmovie.com",
  androidAppId: "",
  color: "#333333",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.allMovieId,
      url: (data) => `https://www.allmovie.com/movie/-${data.allMovieId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.allMovieId,
      url: (data) => `https://www.allmovie.com/movie/-${data.allMovieId}`,
    },
  ],
};
