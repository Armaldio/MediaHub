import radarrIcon from "../../assets/apps/images/jellyfin/assets/play_store.png"; // ponytail: add src/assets/apps/images/radarr/assets/logo.svg when sourced
import { Service, CustomServiceInstance } from "../../types/index";
import { arrHeaders, arrItemUrl, arrSearchUrl } from "./arrShared";

interface RadarrMovie {
  id: number;
  title: string;
  titleSlug?: string;
}

async function findRadarrMovie(
  instance: CustomServiceInstance,
  tmdbId: string
): Promise<RadarrMovie | null> {
  if (!instance.apiKey) return null;
  const base = instance.baseUrl?.replace(/\/$/, "");
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/v3/movie/lookup/tmdb?tmdbId=${tmdbId}`, {
      headers: arrHeaders(instance),
    });
    if (res.ok) return res.json() as Promise<RadarrMovie>;
  } catch {
    // fall through
  }

  return null;
}

export const radarr: Service = {
  id: "radarr",
  name: "Radarr",
  description: "Movie collection manager",
  icon: radarrIcon,
  websiteUrl: "https://radarr.video",
  appUrl: "https://radarr.video",
  androidAppId: "",
  color: "#F18E33",
  supportsCustomInstances: true,
  customInstances: [],
  deepLinks: [
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: async (data, instance) => {
        if (instance?.apiKey) {
          const movie = await findRadarrMovie(instance, data.tmdbId);
          if (movie) return arrItemUrl(instance, "movie", movie);
        }
        if (instance) return arrSearchUrl(instance, data.tmdbId || data.title);
        return "https://radarr.video";
      },
      customUrlBuilder: (data, instance) =>
        arrSearchUrl(instance, data.tmdbId || data.title),
    },
  ],
};
