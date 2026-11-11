import metacriticIcon from "../../assets/apps/images/metacritic/assets/logo.svg";
import { Service } from "../../types/index";
import { metacriticUrl } from "../../utils/knownProviderLinks";

export const metacritic: Service = {
  id: "metacritic",
  name: "Metacritic",
  description: "Movie & TV reviews and scores",
  icon: metacriticIcon,
  websiteUrl: "https://www.metacritic.com",
  appUrl: "https://www.metacritic.com",
  androidAppId: "",
  color: "#FC0101",
  deepLinks: [
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.metacriticId,
      url: metacriticUrl,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.metacriticId,
      url: metacriticUrl,
    },
  ],
};
