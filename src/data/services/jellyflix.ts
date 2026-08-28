import jellyflixIcon from "../../assets/apps/images/jellyflix/assets/logo.svg";
import { createJellyfinClientService } from "./jellyfinClientFactory";

export const jellyflix = createJellyfinClientService({
  id: "jellyflix",
  name: "Jellyflix",
  description: "Cross-platform Jellyfin client",
  icon: jellyflixIcon,
  websiteUrl: "https://jellyflix.app",
  androidAppId: "com.ambark.jellyflix",
  color: "#E50914",
});
