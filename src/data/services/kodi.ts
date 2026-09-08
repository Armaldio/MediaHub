import kodiIcon from "../../assets/apps/images/kodi/assets/play_store.png";
import { Service } from "../../types/index";
import { checkHttpInstance } from "../../utils/instanceHealth";

export const kodi: Service = {
  id: "kodi",
  name: "Kodi",
  description: "Open source media center",
  icon: kodiIcon,
  websiteUrl: "https://kodi.tv",
  appUrl: "https://play.google.com/store/apps/details?id=org.xbmc.kodi",
  androidAppId: "org.xbmc.kodi",
  color: "#17B2E7",
  supportsCustomInstances: true,
  customInstances: [],
  testInstance: (instance) => checkHttpInstance(instance, {
    path: "/jsonrpc?request=%7B%22jsonrpc%22%3A%222.0%22%2C%22method%22%3A%22JSONRPC.Ping%22%2C%22id%22%3A1%7D",
    capabilities: ["Web interface"],
    allowBareHost: true,
  }),
  deepLinks: [
    {
      name: "App",
      mediaType: "all",
      url: (_data, instance) => {
        if (instance) {
          return `kodi://${instance.baseUrl}`;
        }
        return `kodi://`;
      },
      customUrlBuilder: (_data, instance) => {
        return `http://${instance.baseUrl}`;
      },
    },
    {
      name: "Search",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `https://kodi.tv/search?query=${data.tmdbId}&type=movie`,
      requiresApp: true,
    },
    {
      name: "Search",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `https://kodi.tv/search?query=${data.tmdbId}&type=tv`,
      requiresApp: true,
    },
    {
      name: "Search",
      mediaType: "all",
      enabled: (data) => data.type === "movie" || data.type === "tv",
      url: (data) => `https://kodi.tv/search?query=${data.tmdbId}`,
      requiresApp: true,
    },
  ],
};
