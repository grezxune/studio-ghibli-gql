import { type RestFilmRecord } from '../../datasources/studio-ghibli-api.js';
import { type FilmModel } from './film.types.js';

export const mapRestFilmToFilm = (_film: RestFilmRecord): FilmModel => {
  // TODO:
  // - map the Studio Ghibli API DTO to the GraphQL-facing FilmModel
  // - convert empty optional values to null where appropriate
  // - default numeric fields used by summary so output is deterministic
  // - sort tags alphabetically
  throw new Error('TODO: implement mapRestFilmToFilm');
};
