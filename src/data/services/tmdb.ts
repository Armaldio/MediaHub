import tmdbIcon from "../../assets/apps/images/the_movie_database/assets/favicon.png";
import { Service } from "../../types/index";

export const tmdb: Service = {
  id: "the_movie_database",
  name: "TMDB",
  description: "The Movie Database",
  icon: tmdbIcon,
  websiteUrl: "https://www.themoviedb.org",
  appUrl: "https://www.themoviedb.org",
  androidAppId: "",
  color: "#01B4E4",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Website",
      url: (data) => `https://www.themoviedb.org/movie/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Website",
      url: (data) => `https://www.themoviedb.org/tv/${data.tmdbId}`,
    },
  ],
};