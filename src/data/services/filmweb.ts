import filmwebIcon from "../../assets/apps/images/filmweb/assets/logo.svg";
import { Service } from "../../types/index";
import { filmwebUrl } from "../../utils/knownProviderLinks";

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
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.filmwebId,
      url: filmwebUrl,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.filmwebId,
      url: filmwebUrl,
    },
  ],
};
