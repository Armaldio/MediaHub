import tvdbIcon from "../../assets/apps/images/tvdb/assets/favicon.png";
import { Service } from "../../types/index";

export const tvdb: Service = {
  id: "tvdb",
  name: "TheTVDB",
  description: "TV show database",
  icon: tvdbIcon,
  websiteUrl: "https://thetvdb.com",
  color: "#00B4CC",
  appUrl: "https://thetvdb.com",
  androidAppId: "",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.tvdbSlug,
      name: "Website",
      url: (data) => `https://thetvdb.com/movies/${data.tvdbSlug}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.tvdbSlug,
      name: "Website",
      url: (data) => `https://thetvdb.com/series/${data.tvdbSlug}`,
    },
  ],
};