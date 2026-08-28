import findroidIcon from "../../assets/apps/images/findroid/assets/logo.svg";
import { createJellyfinClientService } from "./jellyfinClientFactory";

export const findroid = createJellyfinClientService({
  id: "findroid",
  name: "Findroid",
  description: "Native Android Jellyfin client",
  icon: findroidIcon,
  websiteUrl: "https://findroid.app",
  androidAppId: "dev.findroid.android",
  color: "#6750A4",
});
