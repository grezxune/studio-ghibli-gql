export const directorValues = ['MIYAZAKI', 'TAKAHATA', 'YONEBAYASHI'] as const;

export type FilmDirector = (typeof directorValues)[number];

export interface FilmModel {
  id: string;
  name: string;
  detail: string | null;
  director: FilmDirector | null;
  metric: number;
  tags: string[];
}

export type FilmLookupErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UPSTREAM_ERROR';

export interface FilmLookupError {
  code: FilmLookupErrorCode;
  message: string;
}

export interface FilmLookupResult {
  film: FilmModel | null;
  error: FilmLookupError | null;
}
