import huluIcon from "../../assets/apps/images/hulu/assets/logo.svg";
import { Service } from "../../types/index";
import { withAffiliate } from "../../utils/affiliate";

export const hulu: Service = {
  id: "hulu",
  name: "Hulu",
  description: "Stream TV shows & movies",
  icon: huluIcon,
  websiteUrl: "https://www.hulu.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.hulu.plus",
  androidAppId: "com.hulu.plus",
  color: "#1CE783",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.huluMovieId,
      url: (data) => withAffiliate(`https://www.hulu.com/movie/${data.huluMovieId}`, "hulu"),
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.huluSeriesId,
      url: (data) => withAffiliate(`https://www.hulu.com/series/${data.huluSeriesId}`, "hulu"),
    },
  ],
};
