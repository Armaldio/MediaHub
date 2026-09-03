import metacriticIcon from "../../assets/apps/images/metacritic/assets/logo.svg";
import { Service } from "../../types/index";

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
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.metacriticId,
      url: (data) => `https://www.metacritic.com/movie/${data.metacriticId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.metacriticId,
      url: (data) => `https://www.metacritic.com/tv/${data.metacriticId}`,
    },
  ],
};
