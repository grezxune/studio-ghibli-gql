import { type AppContext } from '../../context.js';
import { type FilmLookupResult, type FilmModel, type FilmDirector } from './film.types.js';

interface FilmQueryArgs {
  id: string;
}

interface FilmCollectionQueryArgs {
  director: FilmDirector;
  limit?: number | null;
}

const normalizeFilmId = (id: string): string => id.trim().toLowerCase();

const isValidFilmId = (id: string): boolean => /^[a-f0-9-]{36}$/.test(id);

export const filmResolvers = {
  Query: {
    film: async (_parent: unknown, arguments_: FilmQueryArgs, _context: AppContext): Promise<FilmLookupResult> => {
      const normalizedId = normalizeFilmId(arguments_.id);

      if (!isValidFilmId(normalizedId)) {
        return {
          film: null,
          error: {
            code: 'INVALID_INPUT',
            message: 'TODO: return a clearer invalid-input message',
          },
        };
      }

      // TODO:
      // - fetch the film from the datasource
      // - return NOT_FOUND when the datasource returns null
      // - return UPSTREAM_ERROR when the REST API is unavailable
      // - return the mapped film on success
      throw new Error('TODO: implement Query.film');
    },

    filmsByDirector: async (_parent: unknown, _arguments: FilmCollectionQueryArgs, _context: AppContext): Promise<FilmModel[]> => {
      // TODO:
      // - fetch films for the requested director
      // - map each DTO into the GraphQL model
      // - sort by name
      // - apply limit after sorting
      // - treat negative limits as 0
      throw new Error('TODO: implement Query.filmsByDirector');
    },
  },

  Film: {
    summary: (_film: FilmModel): string => {
      // TODO:
      // - derive a readable summary from the mapped FilmModel
      // - include name, id, director, metric, and detail/fallback
      throw new Error('TODO: implement Film.summary');
    },
  },
};
