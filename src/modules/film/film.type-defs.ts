export const filmTypeDefs = /* GraphQL */ `
  enum FilmLookupErrorCode {
    INVALID_INPUT
    NOT_FOUND
    UPSTREAM_ERROR
  }

  type FilmLookupError {
    code: FilmLookupErrorCode!
    message: String!
  }

  type Film {
    id: ID!
    name: String!
    detail: String
    tags: [String!]!
    summary: String!
  }

  type FilmLookupResult {
    film: Film
    error: FilmLookupError
  }

  extend type Query {
    film(id: ID!): FilmLookupResult!
  }
`;
