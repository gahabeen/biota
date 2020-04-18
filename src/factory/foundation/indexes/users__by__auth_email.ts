import { query as q } from 'faunadb';
import { Index, BiotaIndexName } from '~/factory/constructors/index';
import { BiotaCollectionName } from '~/factory/constructors/collection';

// tslint:disable-next-line: variable-name
export const users__by__auth_email = Index({
  name: BiotaIndexName('users__by__auth_email'),
  source: {
    collection: q.Collection(BiotaCollectionName('users')),
  },
  terms: [
    {
      field: ['data', '_auth', 'email'],
    },
  ],
  unique: true,
});
