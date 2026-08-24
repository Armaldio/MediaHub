import { FormattedDetails } from "../models/models";
import { useTVDBStore } from "../stores/tvdb";

export const useTVDBData = () => {
  const tvdbStore = useTVDBStore();

  const fetchTVDBData = async (
    formattedDetails: FormattedDetails
  ): Promise<FormattedDetails> => {
    if (!formattedDetails.tvdbId) {
      return formattedDetails;
    }

    try {
      let details: any = null;

      if (formattedDetails.type === "tv") {
        details = await tvdbStore.getSeriesDetails(formattedDetails.tvdbId);
      } else if (formattedDetails.type === "movie") {
        details = await tvdbStore.getMovieDetails(formattedDetails.tvdbId);
      }

      const enhancedDetails = { ...formattedDetails };

      if (details && details.slug) {
        enhancedDetails.tvdbSlug = details.slug;
      }

      return enhancedDetails;
    } catch (error) {
      console.error("Error fetching TVDB data:", error);
    }

    return formattedDetails;
  };

  return { fetchTVDBData };
};
