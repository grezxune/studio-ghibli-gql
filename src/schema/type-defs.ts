import { mergeTypeDefs } from '@graphql-tools/merge';
import { filmTypeDefs } from '../modules/film/film.type-defs.js';

const baseTypeDefs = /* GraphQL */ `
  type Query {
    _empty: Boolean
  }
`;

export const typeDefs = mergeTypeDefs([baseTypeDefs, filmTypeDefs]);
