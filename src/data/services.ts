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
import { youtube } from "./services/youtube";
import { mubi } from "./services/mubi";
import { simkl } from "./services/simkl";
import { tmdb } from "./services/tmdb";
import { tvdb } from "./services/tvdb";
import { allocine } from "./services/allocine";
import { betaseries } from "./services/betaseries";
import { dubbingbase } from "./services/dubbingbase";
import { nzb360 } from "./services/nzb360";
import { seerr } from "./services/seerr";
import { sonarr } from "./services/sonarr";
import { radarr } from "./services/radarr";
import { rottenTomatoes } from "./services/rottenTomatoes";
import { metacritic } from "./services/metacritic";
import { anilist } from "./services/anilist";
import { emby } from "./services/emby";
import { tvmaze } from "./services/tvmaze";
import { peacock } from "./services/peacock";
import { hulu } from "./services/hulu";
import { crunchyroll } from "./services/crunchyroll";
import { kinopoisk } from "./services/kinopoisk";
import { douban } from "./services/douban";
import { filmAffinity } from "./services/filmAffinity";
import { csfd } from "./services/csfd";
import { itunes } from "./services/itunes";
import { googlePlay } from "./services/googlePlay";
import { sensCritique } from "./services/sensCritique";
import { allMovie } from "./services/allMovie";
import { filmweb } from "./services/filmweb";
import { boxOfficeMojo } from "./services/boxOfficeMojo";
import { filmarks } from "./services/filmarks";
import { floppy } from "./services/floppy";
import { yamtrack } from "./services/yamtrack";

export async function fetchTVDBSlug({ tvdbId, type }: FormattedDetails) {
  if (!tvdbId) return undefined;

  const tvdbStore = useTVDBStore();
  const details = type === "tv"
    ? await tvdbStore.getSeriesDetails(tvdbId)
    : await tvdbStore.getMovieDetails(tvdbId);
  return details?.slug;
}

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
  youtube,
  mubi,
  simkl,
  tmdb,
  tvdb,
  allocine,
  betaseries,
  dubbingbase,
  nzb360,
  seerr,
  sonarr,
  radarr,
  rottenTomatoes,
  metacritic,
  anilist,
  emby,
  tvmaze,
  peacock,
  hulu,
  crunchyroll,
  kinopoisk,
  douban,
  filmAffinity,
  csfd,
  itunes,
  googlePlay,
  sensCritique,
  allMovie,
  filmweb,
  boxOfficeMojo,
  filmarks,
  floppy,
  yamtrack,
] satisfies Service[];
