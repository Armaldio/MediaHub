import netflixIcon from "../../assets/apps/images/netflix/assets/play_store.png";
import { Service } from "../../types/index";

export const netflix: Service = {
  id: "netflix",
  name: "Netflix",
  description: "Stream movies and TV shows",
  icon: netflixIcon,
  websiteUrl: "https://netflix.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
  androidAppId: "com.netflix.mediaclient",
  color: "#E50914",
  deepLinks: [
    {
      name: "App",
      mediaType: "all",
      enabled: (data) => !!data.netflixId,
      url: (data) => `netflix://title/${data.netflixId}`,
    },
    {
      name: "Website",
      mediaType: "all",
      enabled: (data) => !!data.netflixId,
      url: (data) => `https://www.netflix.com/title/${data.netflixId}`,
    },
  ],
};