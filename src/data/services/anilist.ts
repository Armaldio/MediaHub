import anilistIcon from "../../assets/apps/images/anilist/assets/logo.svg";
import { Service } from "../../types/index";

// AniList is anime/manga only; the Wikidata P8729 (AniList anime ID) claim
// only exists on anime items, so the link is guarded and naturally hidden
// for non-anime movies/TV.
export const anilist: Service = {
  id: "anilist",
  name: "AniList",
  description: "Track and discover anime & manga",
  icon: anilistIcon,
  websiteUrl: "https://anilist.co",
  appUrl: "https://anilist.co",
  androidAppId: "",
  color: "#1F1F2E",
  deepLinks: [
    {
      name: "Website",
      mediaType: "all",
      enabled: (data) => data.type === "movie" || data.type === "tv",
      url: (data) =>
        data.anilistId
          ? `https://anilist.co/anime/${data.anilistId}`
          : `https://anilist.co/search/anime?query=${encodeURIComponent(data.title || "")}`,
    },
  ],
};
