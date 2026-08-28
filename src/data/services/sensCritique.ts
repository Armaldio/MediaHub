import sensCritiqueIcon from "../../assets/apps/images/senscritique/assets/logo.svg";
import { Service } from "../../types/index";

export const sensCritique: Service = {
  id: "senscritique",
  name: "SensCritique",
  description: "French movie & TV reviews",
  icon: sensCritiqueIcon,
  websiteUrl: "https://www.senscritique.com",
  appUrl: "https://www.senscritique.com",
  androidAppId: "",
  color: "#1A1A1A",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.sensCritiqueId,
      url: (data) => `https://www.senscritique.com/film/-/${data.sensCritiqueId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.sensCritiqueId,
      url: (data) => `https://www.senscritique.com/serie/-/${data.sensCritiqueId}`,
    },
  ],
};
