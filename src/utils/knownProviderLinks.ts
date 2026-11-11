import type { FormattedDetails } from "@/models/models";

export const metacriticUrl = (details: FormattedDetails) =>
  `https://www.metacritic.com/${details.metacriticId}`;

export const filmwebUrl = (details: FormattedDetails) =>
  `https://www.filmweb.pl/film?Id=${details.filmwebId}`;

export const allocineUrl = (details: FormattedDetails) =>
  `https://www.allocine.fr/film/fichefilm_gen_cfilm=${details.allocineId}.html`;

export const hasAllocineMovieId = (details: FormattedDetails) =>
  details.type === "movie" && !!details.allocineId;
