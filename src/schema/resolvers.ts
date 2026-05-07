import { mergeResolvers } from '@graphql-tools/merge';
import { filmResolvers } from '../modules/film/film.resolver.js';

export const resolvers = mergeResolvers([filmResolvers]);
