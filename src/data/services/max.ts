import maxIcon from "../../assets/apps/images/max/assets/play_store.png";
import { Service } from "../../types/index";

export const max: Service = {
  id: "max",
  name: "Max",
  description: "Stream HBO, Warner Bros, DC, and more",
  icon: maxIcon,
  websiteUrl: "https://www.max.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.wbd.stream",
  androidAppId: "com.wbd.stream",
  color: "#8B00FF",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.hboMaxId,
      url: (data) => `max://content/${data.hboMaxId}`,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.hboMaxId,
      url: (data) => `max://content/${data.hboMaxId}`,
    },
    {
      name: "Website",
      mediaType: "all",
      enabled: (data) => !!data.hboMaxId,
      url: (data) => `https://play.max.com/${data.hboMaxId}`,
    },
  ],
};