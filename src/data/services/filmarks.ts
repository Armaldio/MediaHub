import filmarksIcon from "../../assets/apps/images/filmarks/assets/logo.svg";
import { Service } from "../../types/index";

export const filmarks: Service = {
  id: "filmarks",
  name: "Filmarks",
  description: "Japanese movie reviews",
  icon: filmarksIcon,
  websiteUrl: "https://filmarks.com",
  appUrl: "https://filmarks.com",
  androidAppId: "",
  color: "#00A0E9",
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.filmarksId,
      url: (data) => `https://filmarks.com/${data.filmarksId}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.filmarksId,
      url: (data) => `https://filmarks.com/${data.filmarksId}`,
    },
  ],
};
