import boxOfficeMojoIcon from "../../assets/apps/images/boxofficemojo/assets/logo.svg";
import { Service } from "../../types/index";

export const boxOfficeMojo: Service = {
  id: "boxofficemojo",
  name: "Box Office Mojo",
  description: "Box office tracking",
  icon: boxOfficeMojoIcon,
  websiteUrl: "https://www.boxofficemojo.com",
  appUrl: "https://www.boxofficemojo.com",
  androidAppId: "",
  color: "#0A2342",
  deepLinks: [
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.boxOfficeMojoId,
      url: (data) => `https://www.boxofficemojo.com/movies/?id=${data.boxOfficeMojoId}.htm`,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.boxOfficeMojoId,
      url: (data) => `https://www.boxofficemojo.com/movies/?id=${data.boxOfficeMojoId}.htm`,
    },
  ],
};
