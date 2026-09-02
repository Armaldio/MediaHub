import csfdIcon from "../../assets/apps/images/csfd/assets/logo.svg";
import { Service } from "../../types/index";

export const csfd: Service = {
  id: "csfd",
  name: "ČSFD",
  description: "Czech-Slovak film database",
  icon: csfdIcon,
  websiteUrl: "https://www.csfd.cz",
  appUrl: "https://www.csfd.cz",
  androidAppId: "",
  color: "#D32F2F",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.csfdId,
      url: (data) => `https://www.csfd.cz/film/${data.csfdId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.csfdId,
      url: (data) => `https://www.csfd.cz/film/${data.csfdId}`,
    },
  ],
};
