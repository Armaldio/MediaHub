import seerrIcon from "../../assets/apps/images/overseerr/assets/logo.svg";
import { createRequestService } from "./requestServiceFactory";

// Overseerr and its Jellyfin fork Jellyseerr have been consolidated into
// "Seerr" and share the same URL scheme, so a single service covers both.
export const seerr = createRequestService(
  "seerr",
  "Seerr",
  "Request movies & TV for your media server (Overseerr / Jellyseerr)",
  seerrIcon
);
