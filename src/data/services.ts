import { Service } from "../types/index";

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
