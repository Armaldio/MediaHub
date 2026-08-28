import reefinIcon from "../../assets/apps/images/reefin/assets/logo.svg";
import { createJellyfinClientService } from "./jellyfinClientFactory";

export const reefin = createJellyfinClientService({
  id: "reefin",
  name: "Reefin",
  description: "Modern Jellyfin client",
  icon: reefinIcon,
  websiteUrl: "https://reefin.dev",
  androidAppId: "",
  color: "#00C2A8",
});
