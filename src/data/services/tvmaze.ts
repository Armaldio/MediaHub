import tvmazeIcon from "../../assets/apps/images/tvmaze/assets/logo.svg";
import { Service } from "../../types/index";

async function lookupTVMazeShow(
  imdbId?: string,
  tvdbId?: string
): Promise<string | null> {
  const queries: string[] = [];
  if (imdbId) queries.push(`imdb=${imdbId}`);
  if (tvdbId) queries.push(`thetvdb=${tvdbId}`);
  for (const q of queries) {
    try {
      const res = await fetch(`https://api.tvmaze.com/lookup/shows?${q}`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.url) return data.url as string;
      if (data?.id) return `https://www.tvmaze.com/shows/${data.id}`;
    } catch {
      continue;
    }
  }
  return null;
}

export const tvmaze: Service = {
  id: "tvmaze",
  name: "TVmaze",
  description: "TV show database & schedule",
  icon: tvmazeIcon,
  websiteUrl: "https://www.tvmaze.com",
  appUrl: "https://www.tvmaze.com",
  androidAppId: "",
  color: "#FF7A00",
  deepLinks: [
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: async (data) => {
        const url = await lookupTVMazeShow(data.imdbId, data.tvdbId);
        if (url) return url;
        return `https://www.tvmaze.com/search?q=${encodeURIComponent(data.title || "")}`;
      },
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: async (data) => {
        if (data.imdbId || data.tvdbId) {
          const url = await lookupTVMazeShow(data.imdbId, data.tvdbId);
          if (url) return url;
        }
        return `https://www.tvmaze.com/search?q=${encodeURIComponent(data.title || "")}`;
      },
    },
  ],
};
