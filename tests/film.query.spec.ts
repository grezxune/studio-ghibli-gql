import { describe, expect, it, vi } from 'vitest';
import { type AppContext } from '../src/context.js';
import { type RestFilmRecord, UpstreamServiceError } from '../src/datasources/studio-ghibli-api.js';
import { createServer } from '../src/server.js';

const lookupQuery = /* GraphQL */ `
  query Lookup($id: ID!) {
    film(id: $id) {
      film {
        id
        name
        detail
        tags
        summary
      }
      error {
        code
        message
      }
    }
  }
`;


const primary: RestFilmRecord = { id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49', name: 'My Neighbor Totoro', description: 'Two girls move to the country.', directorName: 'Hayao Miyazaki', score: 93, credits: ['Hayao Miyazaki', 'catbus'] };

const createMockContext = () => {
  const getFilmById = vi.fn(async (_id: string) => null as RestFilmRecord | null);

  const context: AppContext = {
    dataSources: {
      studioGhibliApi: {
        getFilmById,
      },
    },
  };

  return { context, getFilmById };
};

const executeSingle = async (query: string, variables: Record<string, unknown>, contextValue: AppContext) => {
  const server = createServer();

  try {
    const response = await server.executeOperation({ query, variables }, { contextValue });

    if (response.body.kind !== 'single') {
      throw new Error('Expected a single GraphQL result.');
    }

    return response.body.singleResult;
  } finally {
    await server.stop();
  }
};

describe('film queries', () => {
  it('returns a mapped film and computed summary for a valid id', async () => {
    const { context, getFilmById } = createMockContext();
    getFilmById.mockResolvedValue(primary);

    const result = await executeSingle(lookupQuery, { id: ' 58611129-2DBC-4A81-A72F-77DDFC1B1B49 ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      film: {
        film: {
          id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
          name: 'My Neighbor Totoro',
          detail: 'Two girls move to the country.',
          tags: ['catbus', 'Hayao Miyazaki'],
          summary: 'My Neighbor Totoro (58611129-2dbc-4a81-a72f-77ddfc1b1b49) is a film in MIYAZAKI. Detail: Two girls move to the country. Rotten Tomatoes score: 93.',
        },
        error: null,
      },
    });
    expect(getFilmById).toHaveBeenCalledWith('58611129-2dbc-4a81-a72f-77ddfc1b1b49');
  });

  it('returns INVALID_INPUT and skips the datasource when the id is malformed', async () => {
    const { context, getFilmById } = createMockContext();

    const result = await executeSingle(lookupQuery, { id: 'totoro' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      film: {
        film: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'Film id must be a UUID.',
        },
      },
    });
    expect(getFilmById).not.toHaveBeenCalled();
  });

  it('returns NOT_FOUND when the datasource cannot find a film', async () => {
    const { context, getFilmById } = createMockContext();
    getFilmById.mockResolvedValue(null);

    const result = await executeSingle(lookupQuery, { id: '11111111-1111-1111-1111-111111111111' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      film: {
        film: null,
        error: {
          code: 'NOT_FOUND',
          message: 'No film found for id "11111111-1111-1111-1111-111111111111".',
        },
      },
    });
  });

  it('returns UPSTREAM_ERROR when the datasource throws an upstream failure', async () => {
    const { context, getFilmById } = createMockContext();
    getFilmById.mockRejectedValue(new UpstreamServiceError('boom'));

    const result = await executeSingle(lookupQuery, { id: ' 58611129-2DBC-4A81-A72F-77DDFC1B1B49 ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      film: {
        film: null,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Studio Ghibli API is currently unavailable.',
        },
      },
    });
  });
});
