import simklIcon from "../../assets/apps/images/simkl/assets/play_store.png";
import { Service } from "../../types/index";

export const simkl: Service = {
  id: "simkl",
  name: "SIMKL",
  description: "Movie &  tracker",
  icon: simklIcon,
  websiteUrl: "https://simkl.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.simkl.lists",
  androidAppId: "com.simkl.lists",
  color: "#2DAF38",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "App",
      url: (data) => `simkl://media/movie/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "App",
      url: (data) => `simkl://media/tv/${data.tmdbId}`,
    },
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Website",
      url: (data) => `https://simkl.com/movies/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Website",
      url: (data) => `https://simkl.com/tv-shows/${data.tmdbId}`,
    },
  ],
};