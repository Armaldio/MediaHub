import googlePlayIcon from "../../assets/apps/images/googleplay/assets/logo.svg";
import { Service } from "../../types/index";

export const googlePlay: Service = {
  id: "googleplay",
  name: "Google Play",
  description: "Google Play Movies & TV",
  icon: googlePlayIcon,
  websiteUrl: "https://play.google.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.google.android.videos",
  androidAppId: "com.google.android.videos",
  color: "#01875F",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.googlePlayId,
      url: (data) => `https://play.google.com/store/movies/details?id=${data.googlePlayId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.googlePlayId,
      url: (data) => `https://play.google.com/store/tv/show?id=${data.googlePlayId}`,
    },
  ],
};
