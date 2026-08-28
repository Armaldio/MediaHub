import doubanIcon from "../../assets/apps/images/douban/assets/logo.svg";
import { Service } from "../../types/index";

export const douban: Service = {
  id: "douban",
  name: "Douban",
  description: "Chinese movie database",
  icon: doubanIcon,
  websiteUrl: "https://movie.douban.com",
  appUrl: "https://movie.douban.com",
  androidAppId: "",
  color: "#2E9B45",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.doubanId,
      url: (data) => `https://movie.douban.com/subject/${data.doubanId}/`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.doubanId,
      url: (data) => `https://movie.douban.com/subject/${data.doubanId}/`,
    },
  ],
};
