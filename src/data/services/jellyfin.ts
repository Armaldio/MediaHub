import jellyfinIcon from "../../assets/apps/images/jellyfin/assets/play_store.png";
import { Service, CustomServiceInstance } from "../../types/index";
import { FormattedDetails } from "../../models/models";

async function findJellyfinItemId(
  instance: CustomServiceInstance,
  tmdbId: string,
  type: "movie" | "tv"
): Promise<string | null> {
  if (!instance.apiKey) return null;
  const includeItemTypes = type === "movie" ? "Movie" : "Series";
  const url = `${instance.baseUrl}/Items?Recursive=true&IncludeItemTypes=${includeItemTypes}&Fields=ProviderIds&api_key=${instance.apiKey}`;
  try {
    const response = await fetch(url, {
      headers: {
        "X-MediaBrowser-Token": instance.apiKey,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const items = data.Items || [];
    for (const item of items) {
      if (item.ProviderIds?.Tmdb === tmdbId) {
        return item.Id;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function buildItemUrl(instance: CustomServiceInstance, itemId: string): string {
  return `${instance.baseUrl}/web/index.html#!/details?id=${itemId}`;
}

function buildSearchUrl(instance: CustomServiceInstance, tmdbId: string): string {
  return `${instance.baseUrl}/web/index.html#!/search?query=${encodeURIComponent(tmdbId)}`;
}

export const jellyfin: Service = {
  id: "jellyfin",
  name: "Jellyfin",
  description: "Open source media system",
  icon: jellyfinIcon,
  websiteUrl: "https://jellyfin.org",
  appUrl: "https://play.google.com/store/apps/details?id=org.jellyfin.mobile",
  androidAppId: "org.jellyfin.mobile",
  color: "#00A4DC",
  supportsCustomInstances: true,
  customInstances: [],
  deepLinks: [
    {
      name: "App",
      mediaType: "all",
      available: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (!instance) return true;
        if (!instance.apiKey) return false;
        if (data.type !== "movie" && data.type !== "tv") return false;
        return !!(await findJellyfinItemId(instance, data.tmdbId, data.type));
      },
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey && (data.type === "movie" || data.type === "tv")) {
          const itemId = await findJellyfinItemId(instance, data.tmdbId, data.type);
          if (itemId) return buildItemUrl(instance, itemId);
        }
        if (instance) return null;
        return `jellyfin://`;
      },
    },
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey) {
          const itemId = await findJellyfinItemId(instance, data.tmdbId, "movie");
          if (itemId) return buildItemUrl(instance, itemId);
        }
        if (instance) return buildSearchUrl(instance, data.tmdbId);
        return `jellyfin://search?query=${encodeURIComponent(data.tmdbId)}`;
      },
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey) {
          const itemId = await findJellyfinItemId(instance, data.tmdbId, "tv");
          if (itemId) return buildItemUrl(instance, itemId);
        }
        if (instance) return buildSearchUrl(instance, data.tmdbId);
        return `jellyfin://search?query=${encodeURIComponent(data.tmdbId)}`;
      },
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "all",
      enabled: (data) => data.type === "movie" || data.type === "tv",
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey) {
          const type = data.type === "movie" ? "movie" : "tv";
          const itemId = await findJellyfinItemId(instance, data.tmdbId, type);
          if (itemId) return buildItemUrl(instance, itemId);
        }
        if (instance) return buildSearchUrl(instance, data.tmdbId);
        return `jellyfin://search?query=${encodeURIComponent(data.tmdbId)}`;
      },
      requiresApp: true,
    },
  ],
};