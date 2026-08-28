import { Service, CustomServiceInstance } from "../../types/index";
import { FormattedDetails } from "../../models/models";

// All these apps are Jellyfin clients. They don't expose a documented
// per-item deep link by TMDB id, so we resolve the item through the user's
// Jellyfin instance (same logic as the Jellyfin service) and open it on the
// server — viewable/playable in any of the clients.
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
      headers: { "X-MediaBrowser-Token": instance.apiKey },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const items = data.Items || [];
    for (const item of items) {
      if (item.ProviderIds?.Tmdb === tmdbId) return item.Id;
    }
  } catch {
    return null;
  }
  return null;
}

function buildServerUrl(instance: CustomServiceInstance, itemId?: string): string {
  return itemId
    ? `${instance.baseUrl}/web/index.html#!/item?id=${itemId}`
    : `${instance.baseUrl}/web/index.html`;
}

interface ClientOptions {
  id: string;
  name: string;
  description: string;
  icon: string;
  websiteUrl: string;
  androidAppId: string;
  color: string;
}

export function createJellyfinClientService(opts: ClientOptions): Service {
  const resolveItem = async (
    data: FormattedDetails,
    instance?: CustomServiceInstance
  ): Promise<string> => {
    if (instance?.apiKey && (data.type === "movie" || data.type === "tv")) {
      const itemId = await findJellyfinItemId(instance, data.tmdbId, data.type);
      return buildServerUrl(instance, itemId ?? undefined);
    }
    return instance ? buildServerUrl(instance) : opts.websiteUrl;
  };

  return {
    id: opts.id,
    name: opts.name,
    description: opts.description,
    icon: opts.icon,
    websiteUrl: opts.websiteUrl,
    appUrl: opts.websiteUrl,
    androidAppId: opts.androidAppId,
    color: opts.color,
    supportsCustomInstances: true,
    customInstances: [],
    deepLinks: [
      {
        name: "Open on server",
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        url: (data, instance) => resolveItem(data, instance),
      },
      {
        name: "Website",
        mediaType: "all",
        enabled: (data) => data.type === "movie" || data.type === "tv",
        url: (_data, instance) =>
          instance ? buildServerUrl(instance) : opts.websiteUrl,
      },
    ],
  };
}
