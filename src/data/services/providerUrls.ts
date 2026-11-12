import type { FormattedDetails } from "../../models/models";

export const tmdbTvUrl = (data: FormattedDetails): string => {
  const showUrl = `https://www.themoviedb.org/tv/${data.tmdbId}`;
  if (data.seasonNumber === undefined) return showUrl;

  const seasonUrl = `${showUrl}/season/${data.seasonNumber}`;
  return data.episodeNumber !== undefined && data.episodeNumber > 0
    ? `${seasonUrl}/episode/${data.episodeNumber}`
    : seasonUrl;
};

export const imdbTvUrl = (data: FormattedDetails): string =>
  `https://imdb.com/title/${imdbTvId(data)}`;

export const imdbTvId = (data: FormattedDetails): string =>
  data.episodeImdbId || data.imdbId || "";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const traktSlug = (data: FormattedDetails): string => {
  const base = slugify(data.title) || data.tmdbId;
  return data.releaseYear ? `${base}-${data.releaseYear}` : base;
};

export const traktTvUrl = (data: FormattedDetails): string => {
  const showUrl = `https://trakt.tv/shows/${data.traktSlug || traktSlug(data)}`;
  if (data.seasonNumber === undefined) return showUrl;

  const seasonUrl = `${showUrl}/seasons/${data.seasonNumber}`;
  return data.episodeNumber !== undefined && data.episodeNumber > 0
    ? `${seasonUrl}/episodes/${data.episodeNumber}`
    : seasonUrl;
};
