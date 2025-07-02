import { FormattedDetails } from "@/models/models";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  websiteUrl: string;
  appUrl: string;
  androidAppId: string;
  deepLinks: DeepLink[];
  color: string;
  category: ServiceCategory;
  isInstalled?: boolean;
}

export interface DeepLink {
  name: string;
  enabled?: (data: FormattedDetails) => boolean;
  url: (data: FormattedDetails) => string;
}

export type ServiceCategory = 
  | 'streaming'
  | 'tracking'
  | 'discovery'
  | 'media_center'
  | 'database'
  | 'social';

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_title: string;
  adult: boolean;
  video: boolean;
  vote_count: number;
  popularity: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  vote_count: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  imdb_id: string;
  homepage: string;
  belongs_to_collection?: Collection;
}

export interface TVShowDetails extends TVShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface ExternalIds {
  imdb_id: string;
  freebase_mid: string;
  freebase_id: string;
  tvdb_id: number;
  tvrage_id: number;
  wikidata_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
}

export type MediaType = 'movie' | 'tv' | 'person'

export interface TrendingItem {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  first_air_date?: string;
  release_date?: string;
  genre_ids: number[];
  original_language: string;
  original_title?: string;
  original_name?: string;
  adult: boolean;
  video?: boolean;
  origin_country?: string[];
};