import mubiIcon from "../../assets/apps/images/mubi/assets/play_store.png";
import { Service } from "../../types/index";

export const mubi: Service = {
  id: "mubi",
  name: "MUBI",
  description: "Curated streaming service for independent films",
  icon: mubiIcon,
  websiteUrl: "https://mubi.com",
  appUrl: "https://play.google.com/store/apps/details?id=com.mubi",
  androidAppId: "com.mubi",
  color: "#FF4B3E",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "App",
      url: (data) => `mubi://films/${data.mubiId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "App",
      url: (data) => `mubi://films/${data.mubiId}`,
    },
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.mubiId,
      name: "Website",
      url: (data) => `https://mubi.com/films/${data.mubiId}`,
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.mubiId,
      name: "Website",
      url: (data) => `https://mubi.com/films/${data.mubiId}`,
    },
  ],
};