import rottenTomatoesIcon from "../../assets/apps/images/rotten_tomatoes/assets/logo.svg";
import { Service } from "../../types/index";

export const rottenTomatoes: Service = {
  id: "rotten_tomatoes",
  name: "Rotten Tomatoes",
  description: "Movie & TV reviews",
  icon: rottenTomatoesIcon,
  websiteUrl: "https://www.rottentomatoes.com",
  appUrl: "https://www.rottentomatoes.com",
  androidAppId: "",
  color: "#FA320A",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.rottenTomatoesId,
      url: (data) => `https://www.rottentomatoes.com/${data.rottenTomatoesId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.rottenTomatoesId,
      url: (data) => `https://www.rottentomatoes.com/${data.rottenTomatoesId}`,
    },
  ],
};
