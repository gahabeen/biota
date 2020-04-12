import { query as q } from 'faunadb';
import { Index, indexNameNormalized } from '~/factory/classes/index';
import { collectionNameNormalized } from '~/factory/classes/collection';

// tslint:disable-next-line: variable-name
export const users__by__auth_account = Index({
  name: indexNameNormalized('users__by__auth_account'),
  source: {
    collection: q.Collection(collectionNameNormalized('users')),
  },
  terms: [
    {
      field: ['data', '_auth', 'accounts', 'provider'],
    },
    {
      field: ['data', '_auth', 'accounts', 'id'],
    },
  ],
  unique: true,
});
