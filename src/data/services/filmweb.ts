import filmwebIcon from "../../assets/apps/images/filmweb/assets/logo.svg";
import { Service } from "../../types/index";

export const filmweb: Service = {
  id: "filmweb",
  name: "Filmweb",
  description: "Polish movie database",
  icon: filmwebIcon,
  websiteUrl: "https://www.filmweb.pl",
  appUrl: "https://www.filmweb.pl",
  androidAppId: "",
  color: "#FFCC00",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.filmwebId,
      url: (data) => `https://www.filmweb.pl/${data.filmwebId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.filmwebId,
      url: (data) => `https://www.filmweb.pl/${data.filmwebId}`,
    },
  ],
};
