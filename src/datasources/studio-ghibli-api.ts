import { z } from 'zod';

const isPresentString = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const RestFilmRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  directorName: z.string().optional().nullable(),
  score: z.number().optional().nullable(),
  credits: z.array(z.string()).optional().nullable(),
});

const RawFilmSchema = z.object({ id: z.string(), title: z.string(), description: z.string().optional().nullable(), director: z.string().optional().nullable(), producer: z.string().optional().nullable(), rt_score: z.string().optional().nullable(), people: z.array(z.string()).optional().nullable() });
const toRecord = (film: z.infer<typeof RawFilmSchema>): RestFilmRecord => ({ id: film.id, name: film.title, description: film.description, directorName: film.director, score: Number.parseInt(film.rt_score ?? '', 10), credits: [film.director, film.producer, ...(film.people ?? [])].filter(isPresentString) });
const parseOne = (body: unknown): RestFilmRecord => toRecord(RawFilmSchema.parse(body));

export type RestFilmRecord = z.infer<typeof RestFilmRecordSchema>;

export interface StudioGhibliApiContract {
  getFilmById(id: string): Promise<RestFilmRecord | null>;
}

export class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export class StudioGhibliApi implements StudioGhibliApiContract {
  constructor(private readonly baseUrl: string) {}

  async getFilmById(id: string): Promise<RestFilmRecord | null> {
    return this.fetchOne(`/films/${encodeURIComponent(id)}`, { allowNotFound: true });
  }

  private async fetchOne(path: string, options: { allowNotFound?: boolean } = {}): Promise<RestFilmRecord | null> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (response.status === 404 && options.allowNotFound) {
      return null;
    }

    if (!response.ok) {
      throw new UpstreamServiceError(`Studio Ghibli API request failed with status ${response.status}`);
    }

    const body: unknown = await response.json();
    return parseOne(body);
  }
}
