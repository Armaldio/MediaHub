import { Service } from "../types/index";
import { FormattedDetails } from "../models/models";
import { useTVDBStore } from "../stores/tvdb";

import { netflix } from "./services/netflix";
import { primeVideo } from "./services/primeVideo";
import { disneyPlus } from "./services/disneyPlus";
import { max } from "./services/max";
import { appleTvPlus } from "./services/appleTvPlus";
import { paramountPlus } from "./services/paramountPlus";
import { moviebase } from "./services/moviebase";
import { letterboxd } from "./services/letterboxd";
import { trakt } from "./services/trakt";
import { justwatch } from "./services/justwatch";
import { imdb } from "./services/imdb";
import { wikidata } from "./services/wikidata";
import { plex } from "./services/plex";
import { jellyfin } from "./services/jellyfin";
import { kodi } from "./services/kodi";
import { avaAssistant } from "./services/avaAssistant";
import { tvTime } from "./services/tvTime";
import { youtube } from "./services/youtube";
import { mubi } from "./services/mubi";
import { simkl } from "./services/simkl";
import { tmdb } from "./services/tmdb";
import { tvdb } from "./services/tvdb";
import { allocine } from "./services/allocine";
import { betaseries } from "./services/betaseries";
import { dubbingbase } from "./services/dubbingbase";
import { nzb360 } from "./services/nzb360";

// Function to fetch TVDB data and enhance FormattedDetails
export const fetchTVDBData = async (
  formattedDetails: FormattedDetails
): Promise<FormattedDetails> => {
  if (!formattedDetails.tvdbId) {
    console.log("No TVDB ID available, returning original details");
    return formattedDetails;
  }

  console.log(
    `Fetching TVDB data for ${formattedDetails.type} with ID: ${formattedDetails.tvdbId}`
  );

  const tvdbStore = useTVDBStore();

  try {
    let details: any = null;

    if (formattedDetails.type === "tv") {
      console.log("Fetching series images from TVDB");
      console.log("Fetching series details from TVDB");
      details = await tvdbStore.getSeriesDetails(formattedDetails.tvdbId);
    } else if (formattedDetails.type === "movie") {
      console.log("Fetching movie images from TVDB");
      console.log("Fetching movie details from TVDB");
      details = await tvdbStore.getMovieDetails(formattedDetails.tvdbId);
    }

    // Enhance the formatted details with TVDB data
    const enhancedDetails = { ...formattedDetails };

    if (details && details.slug) {
      enhancedDetails.tvdbSlug = details.slug;
      console.log("Added TVDB slug to enhanced details");
    }

    console.log("Returning enhanced details with TVDB data");
    return enhancedDetails;
  } catch (error) {
    console.error("Error fetching TVDB data:", error);
  }

  console.log("Returning original details due to error or no data");
  return formattedDetails;
};

export default [
  netflix,
  primeVideo,
  disneyPlus,
  max,
  appleTvPlus,
  paramountPlus,
  moviebase,
  letterboxd,
  trakt,
  justwatch,
  imdb,
  wikidata,
  plex,
  jellyfin,
  kodi,
  avaAssistant,
  tvTime,
  youtube,
  mubi,
  simkl,
  tmdb,
  tvdb,
  allocine,
  betaseries,
  dubbingbase,
  nzb360,
] satisfies Service[];
