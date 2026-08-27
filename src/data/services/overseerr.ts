import overseerrIcon from "../../assets/apps/images/overseerr/assets/logo.svg";
import { createRequestService } from "./requestServiceFactory";

export const overseerr = createRequestService(
  "overseerr",
  "Overseerr",
  "Request movies & TV (also works for Jellyseerr)",
  overseerrIcon
);
