import crunchyrollIcon from "../../assets/apps/images/crunchyroll/assets/logo.svg";
import { Service } from "../../types/index";
import { withAffiliate } from "../../utils/affiliate";

export const crunchyroll: Service = {
  id: "crunchyroll",
  name: "Crunchyroll",
  description: "Stream anime series",
  icon: crunchyrollIcon,
  websiteUrl: "https://www.crunchyroll.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.crunchyroll.crunchyroid",
  androidAppId: "com.crunchyroll.crunchyroid",
  color: "#FF5A00",
  deepLinks: [
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.crunchyrollId,
      url: (data) => withAffiliate(`https://crunchyroll.com/series/${data.crunchyrollId}`, "crunchyroll"),
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.crunchyrollId,
      url: (data) => withAffiliate(`https://crunchyroll.com/series/${data.crunchyrollId}`, "crunchyroll"),
    },
  ],
};
