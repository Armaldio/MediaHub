import betaseriesIcon from "../../assets/apps/images/betaseries/assets/play_store.png";
import { Service } from "../../types/index";

export const betaseries: Service = {
  id: "betaseries",
  name: "BetaSeries",
  description: "TV show tracking",
  icon: betaseriesIcon,
  websiteUrl: "https://www.betaseries.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.betaseriesnative",
  androidAppId: "com.betaseriesnative",
  color: "#00A4DC",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "App",
      url: (data) => `betaseries://movie/${data.tmdbId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "App",
      url: (data) => `betaseries://shows/${data.tmdbId}`,
    },
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Website",
      url: (data) =>
        `https://www.betaseries.com/movie/${data.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Website",
      url: (data) =>
        `https://www.betaseries.com/serie/${data.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`,
    },
  ],
};