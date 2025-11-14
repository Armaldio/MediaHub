import avaAssistantIcon from "../../assets/apps/images/ava_assistant/assets/play_store.png";
import { Service } from "../../types/index";

export const avaAssistant: Service = {
  id: "ava_assistant",
  name: "AVA Assistant",
  description: "AI movie recommendations",
  icon: avaAssistantIcon,
  websiteUrl: "https://ava-assistant.app",
  appUrl: "https://play.google.com/store/apps/details?id=de.ava",
  androidAppId: "de.ava",
  color: "#9C27B0",
  deepLinks: [
    {
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      name: "App",
      url: (data) => {
        const url = `https://ava-assistant.app/movie/${data.tmdbId}`;
        console.log("url", url);
        return url;
      },
    },
    {
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      name: "App",
      url: (data) => {
        console.log(data);
        const url = `https://ava-assistant.app/show/?id=${data.tmdbId}`;
        console.log("url", url);
        return url;
      },
    },
  ],
};