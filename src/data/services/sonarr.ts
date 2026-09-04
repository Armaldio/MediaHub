import sonarrIcon from "../../assets/apps/images/jellyfin/assets/play_store.png"; // ponytail: add src/assets/apps/images/sonarr/assets/logo.svg when sourced
import { Service, CustomServiceInstance } from "../../types/index";
import { FormattedDetails } from "../../models/models";
import { arrHeaders, arrItemUrl, arrSearchUrl } from "./arrShared";

interface SonarrSeries {
  id: number;
  title: string;
  titleSlug?: string;
  tvdbId?: number;
}

async function findSonarrSeries(
  instance: CustomServiceInstance,
  data: FormattedDetails
): Promise<SonarrSeries | null> {
  if (!instance.apiKey) return null;
  const base = instance.baseUrl?.replace(/\/$/, "");
  if (!base) return null;

  // Prefer lookup by TMDB id (Sonarr v3 supports tmdb: term).
  try {
    const res = await fetch(`${base}/api/v3/series/lookup?term=tmdb:${data.tmdbId}`, {
      headers: arrHeaders(instance),
    });
    if (res.ok) {
      const arr: SonarrSeries[] = await res.json();
      if (arr.length) return arr[0];
    }
  } catch {
    // fall through to TVDB lookup
  }

  if (data.tvdbId) {
    try {
      const res = await fetch(`${base}/api/v3/series/lookup?term=tvdb:${data.tvdbId}`, {
        headers: arrHeaders(instance),
      });
      if (res.ok) {
        const arr: SonarrSeries[] = await res.json();
        if (arr.length) return arr[0];
      }
    } catch {
      // fall through
    }
  }

  return null;
}

export const sonarr: Service = {
  id: "sonarr",
  name: "Sonarr",
  description: "TV series collection manager",
  icon: sonarrIcon,
  websiteUrl: "https://sonarr.tv",
  appUrl: "https://sonarr.tv",
  androidAppId: "",
  color: "#3F8AE3",
  supportsCustomInstances: true,
  customInstances: [],
  deepLinks: [
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: async (data, instance) => {
        if (instance?.apiKey) {
          const series = await findSonarrSeries(instance, data);
          if (series) return arrItemUrl(instance, "series", series);
        }
        if (instance) return arrSearchUrl(instance, data.tvdbId || data.title);
        return "https://sonarr.tv";
      },
      customUrlBuilder: (data, instance) =>
        arrSearchUrl(instance, data.tvdbId || data.title),
    },
  ],
};
