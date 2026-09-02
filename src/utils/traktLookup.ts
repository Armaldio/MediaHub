import { FormattedDetails } from "../models/models";

const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID as
  | string
  | undefined;

const cache = new Map<string, string | null>();

export const getTraktSlug = async (
  formattedDetails: FormattedDetails
): Promise<string | null> => {
  if (!formattedDetails.tmdbId) return null;
  const cacheKey = `${formattedDetails.type}-${formattedDetails.tmdbId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const tmdbKey = import.meta.env.VITE_TMDB_KEY;
  const tmdbType = formattedDetails.type === "tv" ? "tv" : "movie";
  const type: "movie" | "tv" =
    formattedDetails.type === "tv" ? "tv" : "movie";

  const slug = await (async () => {
    if (!tmdbKey) return null;

    const url = `https://api.themoviedb.org/3/${tmdbType}/${formattedDetails.tmdbId}?append_to_response=external_ids&language=en-US`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${tmdbKey}` },
      });
      if (!response.ok) return null;
      const data = await response.json();
      const traktId = data.external_ids?.trakt;
      if (traktId) return await lookupTraktSlug(traktId, type);

      const wikidataId = data.external_ids?.wikidata_id;
      if (wikidataId) {
        const traktIdFromWiki = await lookupTraktIdFromWikidata(wikidataId);
        if (traktIdFromWiki) return await lookupTraktSlug(traktIdFromWiki, type);
      }
    } catch {
      // fall through
    }
    return null;
  })();

  cache.set(cacheKey, slug);
  return slug;
};

async function lookupTraktIdFromWikidata(
  wikidataId: string
): Promise<number | null> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const claims = data?.entities?.[wikidataId]?.claims?.["P1232"];
    if (!claims) return null;
    for (const claim of claims) {
      const val = claim?.mainsnak?.datavalue?.value;
      if (typeof val === "string") return Number(val);
    }
  } catch {
    // fall through
  }
  return null;
}

async function lookupTraktSlug(
  traktId: number,
  type: "movie" | "tv"
): Promise<string | null> {
  if (!TRAKT_CLIENT_ID) return null;
  const traktType = type === "tv" ? "shows" : "movies";
  const url = `https://api.trakt.tv/${traktType}/${traktId}?extended=false`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.ids?.slug ?? null;
  } catch {
    return null;
  }
}
