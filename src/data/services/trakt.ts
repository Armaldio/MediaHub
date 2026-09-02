import traktIcon from "../../assets/apps/images/trakt/assets/play_store.png";
import { Service } from "../../types/index";
import { FormattedDetails } from "../../models/models";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fallbackSlug = (data: FormattedDetails): string => {
  const base = slugify(data.title) || data.tmdbId;
  return data.releaseYear ? `${base}-${data.releaseYear}` : base;
};

const traktSlug = (data: FormattedDetails): string =>
  data.traktSlug || fallbackSlug(data);

export const trakt: Service = {
  id: "trakt",
  name: "Trakt",
  description: "Track what you watch",
  icon: traktIcon,
  websiteUrl: "https://trakt.tv",
  appUrl: "https://play.google.com/store/apps/details?id=tv.trakt.trakt",
  androidAppId: "tv.trakt.trakt",
  color: "#ED1C24",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `trakt://movie/${traktSlug(data)}`,
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `trakt://show/${traktSlug(data)}`,
      requiresApp: true,
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data) => `https://trakt.tv/movies/${traktSlug(data)}`,
    },
    {
      name: "Website",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data) => `https://trakt.tv/shows/${traktSlug(data)}`,
    },
  ],
};