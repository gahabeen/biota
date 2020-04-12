import { query as q } from 'faunadb';
import { Index, BiotaIndexName } from '~/factory/classes/index';

// tslint:disable-next-line: variable-name
export const credentials__by__instance = Index({
  name: BiotaIndexName('credentials__by__instance'),
  source: {
    collection: q.Credentials(),
  },
  terms: [
    {
      field: ['instance'],
    },
  ],
  values: [
    {
      field: ['ref'],
    },
  ],
});
