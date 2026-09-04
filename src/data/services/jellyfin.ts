import jellyfinIcon from "../../assets/apps/images/jellyfin/assets/play_store.png";
import { Service, CustomServiceInstance } from "../../types/index";
import { FormattedDetails } from "../../models/models";

interface JellyfinSearchHint {
  ItemId?: string;
  Id?: string;
  Type?: string;
  Name?: string;
}

async function findJellyfinItemId(
  instance: CustomServiceInstance,
  tmdbId: string,
  title: string,
  type: "movie" | "tv"
): Promise<string | null> {
  if (!instance.apiKey) return null;
  const headers = {
    "X-MediaBrowser-Token": instance.apiKey,
  };

  const wantedKind = type === "movie" ? "Movie" : "Series";

  const hintsUrl =
    `${instance.baseUrl}/Search/Hints?` +
    `searchTerm=${encodeURIComponent(title)}&` +
    `${type === "movie" ? "isMovie=true" : "isSeries=true"}&` +
    `limit=10`;

  try {
    const response = await fetch(hintsUrl, { headers });
    if (response.ok) {
      const data = await response.json();
      const hints: JellyfinSearchHint[] = data.SearchHints || [];
      const match = hints.find(
        (h) =>
          (h.ItemId || h.Id) &&
          h.Type?.toLowerCase() === wantedKind.toLowerCase()
      );
      if (match) return match.ItemId || match.Id || null;
    }
  } catch {
    // fall through to provider scan
  }

  const itemsUrl =
    `${instance.baseUrl}/Items?Recursive=true&` +
    `IncludeItemTypes=${wantedKind}&Fields=ProviderIds`;
  try {
    const response = await fetch(itemsUrl, { headers });
    if (!response.ok) return null;
    const data = await response.json();
    const items: { Id?: string; ProviderIds?: { Tmdb?: string } }[] =
      data.Items || [];
    const match = items.find((item) => item.ProviderIds?.Tmdb === tmdbId);
    return match?.Id ?? null;
  } catch {
    return null;
  }
}

function buildItemUrl(itemId: string): string {
  return `jellyfin://item/${itemId}`;
}

function buildSearchUrl(instance: CustomServiceInstance, query: string): string {
  return `${instance.baseUrl}/web/index.html#!/search?query=${encodeURIComponent(query)}`;
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
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey && (data.type === "movie" || data.type === "tv")) {
          const itemId = await findJellyfinItemId(
            instance,
            data.tmdbId,
            data.title,
            data.type as "movie" | "tv"
          );
          if (itemId) return buildItemUrl(itemId);
        }
        if (instance) return buildSearchUrl(instance, data.title);
        return `jellyfin://`;
      },
      customUrlBuilder: (data: FormattedDetails, instance: CustomServiceInstance) => {
        return buildSearchUrl(instance, data.title);
      },
    },
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: async (data: FormattedDetails, instance?: CustomServiceInstance) => {
        if (instance?.apiKey) {
          const itemId = await findJellyfinItemId(instance, data.tmdbId, data.title, "movie");
          if (itemId) return buildItemUrl(itemId);
        }
        if (instance) return buildSearchUrl(instance, data.title);
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
          const itemId = await findJellyfinItemId(instance, data.tmdbId, data.title, "tv");
          if (itemId) return buildItemUrl(itemId);
        }
        if (instance) return buildSearchUrl(instance, data.title);
        return `jellyfin://search?query=${encodeURIComponent(data.tmdbId)}`;
      },
      requiresApp: true,
    },
  ],
};
