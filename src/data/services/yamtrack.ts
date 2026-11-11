import yamtrackIcon from "../../assets/apps/images/yamtrack/assets/icon.png";
import { CustomServiceInstance, Service } from "../../types/index";
import { FormattedDetails } from "../../models/models";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const detailUrl = (data: FormattedDetails, instance?: CustomServiceInstance): string => {
  if (!instance) return "https://github.com/FuzzyGrim/Yamtrack";
  const baseUrl = instance.baseUrl.replace(/\/$/, "");
  const type = data.type === "movie" ? "movie" : "tv";
  const title = slugify(data.title) || data.tmdbId;
  // Yamtrack's upstream route: src/app/urls.py, details/<source>/<media_type>/<media_id>/<title>.
  return `${baseUrl}/details/tmdb/${type}/${encodeURIComponent(data.tmdbId)}/${encodeURIComponent(title)}`;
};

export const yamtrack: Service = {
  id: "yamtrack",
  name: "Yamtrack",
  description: "Self-hosted media tracker",
  icon: yamtrackIcon,
  websiteUrl: "https://github.com/FuzzyGrim/Yamtrack",
  appUrl: "https://github.com/FuzzyGrim/Yamtrack",
  androidAppId: "",
  color: "#4f46e5",
  supportsCustomInstances: true,
  customInstances: [],
  deepLinks: [
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie",
      url: (data, instance) => detailUrl(data, instance),
      customUrlBuilder: (data, instance) => detailUrl(data, instance),
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv",
      url: (data, instance) => detailUrl(data, instance),
      customUrlBuilder: (data, instance) => detailUrl(data, instance),
    },
  ],
};
