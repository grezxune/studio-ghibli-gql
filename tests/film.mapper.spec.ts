import { describe, expect, it } from 'vitest';
import { type RestFilmRecord } from '../src/datasources/studio-ghibli-api.js';
import { mapRestFilmToFilm } from '../src/modules/film/film.mapper.js';

const primary: RestFilmRecord = { id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49', name: 'My Neighbor Totoro', description: 'Two girls move to the country.', directorName: 'Hayao Miyazaki', score: 93, credits: ['Hayao Miyazaki', 'catbus'] };
const sparse: RestFilmRecord = { id: '00000000-0000-0000-0000-000000000000', name: 'Unknown Film', description: '', directorName: null, score: null, credits: [] };

describe('mapRestFilmToFilm', () => {
  it('maps a Studio Ghibli API response into the GraphQL model', () => {
    expect(mapRestFilmToFilm(primary)).toEqual({ id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49', name: 'My Neighbor Totoro', detail: 'Two girls move to the country.', director: 'MIYAZAKI', metric: 93, tags: ['catbus', 'Hayao Miyazaki'] });
  });

  it('normalizes empty optional values, defaults metrics, and sorts tags', () => {
    expect(mapRestFilmToFilm(sparse)).toEqual({ id: '00000000-0000-0000-0000-000000000000', name: 'Unknown Film', detail: null, director: null, metric: 0, tags: [] });
  });
});
