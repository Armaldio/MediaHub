import filmAffinityIcon from "../../assets/apps/images/filmaffinity/assets/logo.svg";
import { Service } from "../../types/index";

export const filmAffinity: Service = {
  id: "filmaffinity",
  name: "FilmAffinity",
  description: "Spanish movie database",
  icon: filmAffinityIcon,
  websiteUrl: "https://www.filmaffinity.com",
  appUrl: "https://www.filmaffinity.com",
  androidAppId: "",
  color: "#447CAD",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.filmAffinityId,
      url: (data) => `https://www.filmaffinity.com/en/film${data.filmAffinityId}.html`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.filmAffinityId,
      url: (data) => `https://www.filmaffinity.com/en/film${data.filmAffinityId}.html`,
    },
  ],
};
