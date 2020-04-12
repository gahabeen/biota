import { query as q } from 'faunadb';
import { Index, indexNameNormalized } from '~/factory/classes/index';
import { collectionNameNormalized } from '~/factory/classes/collection';

// tslint:disable-next-line: variable-name
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
