import * as fauna from 'faunadb';
const q = fauna.query;
import { Index, indexNameNormalized } from '~/factory/classes/index';
import { collectionNameNormalized } from '~/factory/classes/collection';

export const users__by__email = Index({
  name: indexNameNormalized('users__by__email'),
  source: {
    collection: q.Collection(collectionNameNormalized('users')),
  },
  terms: [
    {
      field: ['data', '_auth', 'email'],
    },
  ],
  unique: true,
});
