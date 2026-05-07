# TypeScript + GraphQL Exercise

## Overview

You are joining a codebase that exposes a small GraphQL API over a REST datasource. The project uses modular GraphQL SDL, resolver composition, a typed context datasource, Zod DTO parsing, and focused tests.

## What You Are Building

You are implementing a small GraphQL service backed by the public [Studio Ghibli API](https://ghibliapi.vercel.app/).

Use this REST API base URL when wiring the datasource:

```text
https://ghibliapi.vercel.app
```

The schema exposes:

- `film(id: ID!): FilmLookupResult!`

The public `Film` type stays intentionally small: `id`, `name`, `detail`, `tags`, and `summary`.

## Your Task

Make the supplied tests pass by completing:

- `src/context.ts`
- `src/modules/film/film.mapper.ts`
- `src/modules/film/film.resolver.ts`

Functional requirements:

- validate and normalize `id` for `film`
- return `INVALID_INPUT`, `NOT_FOUND`, and `UPSTREAM_ERROR` in the lookup result when appropriate
- map REST DTOs into the GraphQL model with null/default/sorted-array handling
- compute a deterministic `Film.summary`

## How To Run

```bash
pnpm install
pnpm test
pnpm run typecheck
```
