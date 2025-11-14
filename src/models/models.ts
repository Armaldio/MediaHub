export interface ExternalIds {
  imdb_id?: string;
  wikidata_id?: string;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
  netflixId?: string;
  amazonPrimeId?: string;
  disneyPlusId?: string;
  hboMaxId?: string;
  appleTvId?: string;
  paramountPlusId?: string;
  letterboxdId?: string;
  mubiId?: string;
}

export interface FormattedDetails {
  type: string;
  tmdbId: string;
  imdbId?: string;
  tvdbId?: string;
  netflixId?: string;
  amazonPrimeId?: string;
  disneyPlusId?: string;
  hboMaxId?: string;
  appleTvId?: string;
  paramountPlusId?: string;
  letterboxdId?: string;
  mubiId?: string;
  wikidataId?: string;
  facebookId?: string;
  instagramId?: string;
  twitterId?: string;
  title: string;
  releaseYear?: string;
  rating?: number;
  runtime?: string;
  genres?: {
    id: number;
    name: string;
  }[];
  overview?: string;
  // TVDB-specific fields
  tvdbPoster?: string;
  tvdbBackdrop?: string;
  tvdbBanner?: string;
  tvdbLogo?: string;
  tvdbSlug?: string;
}
