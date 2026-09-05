import imdbIcon from "../../assets/apps/images/imdb/assets/play_store.png";
import { Service } from "../../types/index";

export const imdb: Service = {
  id: "imdb",
  name: "IMDb",
  description: "Movie database & ratings",
  icon: imdbIcon,
  websiteUrl: "https://imdb.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.imdb.mobile",
  androidAppId: "com.imdb.mobile",
  color: "#F5C518",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.imdbId,
      url: (data) => `imdb:///title/${data.imdbId}`,
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.imdbId,
      url: (data) => `imdb:///title/${data.imdbId}`,
      requiresApp: true,
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.imdbId,
      url: (data) => `https://imdb.com/title/${data.imdbId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.imdbId,
      url: (data) => `https://imdb.com/title/${data.imdbId}`,
    },
  ],
};