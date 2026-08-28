import itunesIcon from "../../assets/apps/images/itunes/assets/logo.svg";
import { Service } from "../../types/index";

export const itunes: Service = {
  id: "itunes",
  name: "iTunes",
  description: "Apple iTunes Store",
  icon: itunesIcon,
  websiteUrl: "https://itunes.apple.com",
  appUrl: "https://itunes.apple.com",
  androidAppId: "",
  color: "#000000",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.itunesId,
      url: (data) => `https://itunes.apple.com/us/movie/id${data.itunesId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.itunesId,
      url: (data) => `https://itunes.apple.com/us/tv-show/id${data.itunesId}`,
    },
  ],
};
