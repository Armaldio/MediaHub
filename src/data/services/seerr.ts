// Seerr (Overseerr / Jellyseerr) integration is implemented via the
// useSeerr composable in src/composables/useSeerr.ts. The composable
// handles API requests + status checks; this file only declares the
// service shape so the service appears in the list.
import seerrIcon from "../../assets/apps/images/seerr/assets/brand.png";
import { Service } from "../../types/index";
import { checkHttpInstance } from "../../utils/instanceHealth";

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
  testInstance: (instance) => checkHttpInstance(instance, {
    path: "/api/v1/auth/me",
    headers: instance.apiKey ? { "X-Api-Key": instance.apiKey } : undefined,
    capabilities: ["Web interface", "Request support", "API access"],
    missingCredential: "Add an API key to verify this Seerr instance.",
  }),
  deepLinks: [],
};
