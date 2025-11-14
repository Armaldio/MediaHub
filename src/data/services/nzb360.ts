import nzb360Icon from "../../assets/apps/images/nzb360/assets/play_store.png";
import { Service } from "../../types/index";

export const nzb360: Service = {
  id: "nzb360",
  name: "nzb360",
  description: "All-in-one download manager for your favorite services",
  icon: nzb360Icon,
  websiteUrl: "https://nzb360.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.kevinforeman.nzb360",
  androidAppId: "com.kevinforeman.nzb360",
  color: "#4CAF50",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Add Movie",
      url: (data) => `nzb360://radarr?movieId=${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Add to app",
      url: (data) => `nzb360://sonarr?seriesId=${data.tmdbId}`,
    },
    {
      mediaType: "all",
      enabled: (data) => data.type === "movie" || data.type === "tv",
      name: "Open App",
      url: (data) =>
        `nzb360://search?query=${encodeURIComponent(data.title || "")}`,
    },
  ],
};