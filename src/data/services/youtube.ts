import youtubeIcon from "../../assets/apps/images/youtube/assets/play_store.png";
import { Service } from "../../types/index";

export const youtube: Service = {
  id: "youtube",
  name: "YouTube",
  description: "Video platform",
  icon: youtubeIcon,
  websiteUrl: "https://www.youtube.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.google.android.youtube",
  androidAppId: "com.google.android.youtube",
  color: "#FF0000",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Search in App",
      url: (data) =>
        `vnd.youtube://search?query=${encodeURIComponent(data.title || "")}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Search in App",
      url: (data) =>
        `vnd.youtube://search?query=${encodeURIComponent(data.title || "")}`,
    },
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "Website",
      url: (data) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          data.title || ""
        )}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "Website",
      url: (data) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          data.title || ""
        )}`,
    },
  ],
};