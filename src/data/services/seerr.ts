// Seerr (Overseerr / Jellyseerr) integration is implemented via the
// useSeerr composable in src/composables/useSeerr.ts. The composable
// handles API requests + status checks; this file only declares the
// service shape so the service appears in the list.
import seerrIcon from "../../assets/apps/images/emby/assets/logo.svg"; // ponytail: embys logo placeholder, add src/assets/apps/images/overseerr/assets/logo.svg when asset is sourced
import { Service } from "../../types/index";

export const seerr: Service = {
  id: "seerr",
  name: "Seerr",
  description: "Request movies & TV for your media server (Overseerr / Jellyseerr)",
  icon: seerrIcon,
  websiteUrl: "https://overseerr.dev",
  appUrl: "https://overseerr.dev",
  androidAppId: "",
  color: "#00A8E8",
  supportsCustomInstances: true,
  customInstances: [],
  deepLinks: [],
};
