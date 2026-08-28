import fladderIcon from "../../assets/apps/images/fladder/assets/logo.svg";
import { createJellyfinClientService } from "./jellyfinClientFactory";

export const fladder = createJellyfinClientService({
  id: "fladder",
  name: "Fladder",
  description: "Jellyfin client for Android & Linux",
  icon: fladderIcon,
  websiteUrl: "https://github.com/IslandGarp/Fladder",
  androidAppId: "",
  color: "#2196F3",
});
