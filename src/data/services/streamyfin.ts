import streamyfinIcon from "../../assets/apps/images/streamyfin/assets/logo.svg";
import { createJellyfinClientService } from "./jellyfinClientFactory";

export const streamyfin = createJellyfinClientService({
  id: "streamyfin",
  name: "Streamyfin",
  description: "Modern Jellyfin client (Expo)",
  icon: streamyfinIcon,
  websiteUrl: "https://streamyfin.app",
  androidAppId: "com.fredrikburmester.streamyfin",
  color: "#F04124",
});
