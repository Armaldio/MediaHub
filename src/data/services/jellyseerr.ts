import overseerrIcon from "../../assets/apps/images/overseerr/assets/logo.svg";
import { createRequestService } from "./requestServiceFactory";

// Jellyseerr is a drop-in fork of Overseerr for Jellyfin and uses the exact
// same URL scheme, so it is covered by the same request service logic.
export const jellyseerr = createRequestService(
  "jellyseerr",
  "Jellyseerr",
  "Request movies & TV for Jellyfin (Overseerr fork)",
  overseerrIcon
);
