import { Service, CustomServiceInstance } from "../../types/index";
import { FormattedDetails } from "../../models/models";

const DEFAULT_BASE = "https://overseerr.dev";

function baseUrlOf(instance?: CustomServiceInstance): string {
  return instance?.baseUrl?.replace(/\/$/, "") || DEFAULT_BASE;
}

function searchUrl(instance: CustomServiceInstance | undefined, data: FormattedDetails): string {
  return `${baseUrlOf(instance)}/search?query=${encodeURIComponent(data.title)}`;
}

// Overseerr and its Jellyfin fork Jellyseerr share the same URL scheme, so a
// single request service covers both. TV resolves via TVDB, movie via TMDB,
// with a title search fallback when the external ID is missing.
export function createRequestService(
  id: string,
  name: string,
  description: string,
  icon: string
): Service {
  return {
    id,
    name,
    description,
    icon,
    websiteUrl: "https://overseerr.dev",
    appUrl: "https://overseerr.dev",
    androidAppId: "",
    color: "#00A8E8",
    supportsCustomInstances: true,
    customInstances: [],
    deepLinks: [
      {
        name: "Website",
        mediaType: "movie",
        enabled: (data) => data.type === "movie",
        url: (data, instance) =>
          data.tmdbId
            ? `${baseUrlOf(instance)}/movie/${data.tmdbId}`
            : searchUrl(instance, data),
        customUrlBuilder: (data, instance) =>
          data.tmdbId
            ? `${baseUrlOf(instance)}/movie/${data.tmdbId}`
            : searchUrl(instance, data),
      },
      {
        name: "Website",
        mediaType: "tv",
        enabled: (data) => data.type === "tv",
        url: (data, instance) =>
          data.tvdbId
            ? `${baseUrlOf(instance)}/tv/${data.tvdbId}`
            : searchUrl(instance, data),
        customUrlBuilder: (data, instance) =>
          data.tvdbId
            ? `${baseUrlOf(instance)}/tv/${data.tvdbId}`
            : searchUrl(instance, data),
      },
    ],
  };
}
