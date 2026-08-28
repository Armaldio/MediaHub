import peacockIcon from "../../assets/apps/images/peacock/assets/logo.svg";
import { Service } from "../../types/index";
import { withAffiliate } from "../../utils/affiliate";

export const peacock: Service = {
  id: "peacock",
  name: "Peacock",
  description: "Stream NBCUniversal movies & TV",
  icon: peacockIcon,
  websiteUrl: "https://www.peacocktv.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.peacocktv.peacockandroid",
  androidAppId: "com.peacocktv.peacockandroid",
  color: "#00B3E6",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.peacockId,
      url: (data) => withAffiliate(`https://www.peacocktv.com/stream-${data.peacockId}`, "peacock"),
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.peacockId,
      url: (data) => withAffiliate(`https://www.peacocktv.com/stream-${data.peacockId}`, "peacock"),
    },
  ],
};
