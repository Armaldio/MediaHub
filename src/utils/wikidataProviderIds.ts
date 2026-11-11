import type { FormattedDetails } from "@/models/models";

type WikidataClaim = {
  mainsnak?: { datavalue?: { value?: unknown } };
};

const propertyByField: Record<string, string> = {
  rottenTomatoesId: "P1258",
  metacriticId: "P1712",
  anilistId: "P8729",
  peacockId: "P11815",
  huluMovieId: "P6466",
  huluSeriesId: "P6467",
  crunchyrollId: "P11330",
  kinopoiskId: "P2603",
  doubanId: "P4529",
  filmAffinityId: "P480",
  csfdId: "P2529",
  itunesId: "P6398",
  allMovieId: "P1562",
  allocineId: "P1265",
  filmwebId: "P5032",
  boxOfficeMojoId: "P1237",
};

export function extractWikidataProviderIds(
  claims: Record<string, WikidataClaim[] | undefined>,
  type: string
): Partial<FormattedDetails> {
  const ids: Partial<FormattedDetails> = {};
  for (const [field, property] of Object.entries(propertyByField)) {
    if ((field === "huluMovieId" && type !== "movie") ||
        (field === "huluSeriesId" && type !== "tv") ||
        (field === "crunchyrollId" && type !== "tv") ||
        (field === "itunesId" && type !== "movie") ||
        (field === "boxOfficeMojoId" && type !== "movie")) continue;

    const value = claims[property]?.[0]?.mainsnak?.datavalue?.value;
    if (typeof value === "string" || typeof value === "number") {
      (ids as Record<string, string>)[field] = String(value);
    }
  }
  return ids;
}

export const WIKIDATA_PROVIDER_PROPERTIES = [
  ...new Set(Object.values(propertyByField)),
  "P1874", "P8055", "P8298", "P13147", "P6127", "P7299",
];
