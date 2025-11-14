import wikidataIcon from "../../assets/apps/images/wikidata/assets/play_store.png";
import { Service } from "../../types/index";

export const wikidata: Service = {
  id: "wikidata",
  name: "Wikidata",
  description: "Structured knowledge base",
  icon: wikidataIcon,
  websiteUrl: "https://wikidata.org",
  appUrl: "https://play.google.com/store/apps/details?id=org.wikipedia",
  androidAppId: "org.wikipedia",
  color: "#006699",
  deepLinks: [
    {
      name: "Wikidata website",
      mediaType: "all",
      enabled: (data) => !!data.wikidataId,
      url: (data) => `https://wikidata.org/wiki/${data.wikidataId}`,
    },
    {
      name: "Wikidata app",
      mediaType: "all",
      enabled: (data) => !!data.wikidataId,
      url: (data) => `wikidata://entity/${data.wikidataId}`,
    },
    {
      name: "Wikipedia page",
      mediaType: "all",
      enabled: (data) => !!data.wikidataId,
      url: async (data) => {
        if (!data.wikidataId) return "";
        try {
          // First, get the Wikipedia page title from Wikidata
          const response = await fetch(
            `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${data.wikidataId}&props=sitelinks&format=json&origin=*`
          );
          const result = await response.json();

          // Get the English Wikipedia page title if available
          const pageTitle =
            result.entities[data.wikidataId]?.sitelinks?.enwiki?.title;

          if (pageTitle) {
            return `https://en.wikipedia.org/wiki/${encodeURIComponent(
              pageTitle.replace(/ /g, "_")
            )}`;
          }

          // Fallback to direct Wikidata ID if no page title found
          return `https://www.wikidata.org/wiki/${data.wikidataId}`;
        } catch (error) {
          console.error("Error fetching Wikipedia page:", error);
          // Fallback to direct Wikidata link on error
          return `https://www.wikidata.org/wiki/${data.wikidataId}`;
        }
      },
    },
  ],
};