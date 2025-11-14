import moviebaseIcon from "../../assets/apps/images/moviebase/assets/play_store.png";
import { Service } from "../../types/index";

export const moviebase: Service = {
  id: "moviebase",
  name: "Moviebase",
  description: "Track movies & TV shows",
  icon: moviebaseIcon,
  websiteUrl: "https://moviebase.app",
  appUrl: "https://play.google.com/store/apps/details?id=com.moviebase",
  androidAppId: "com.moviebase",
  color: "#FF6B35",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `moviebase://movie/${data.tmdbId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `moviebase://imdb/${data.imdbId}`,
    },
  ],
};