import { query as q } from 'faunadb';
import { Index, BiotaIndexName } from '~/factory/constructors/index';

// tslint:disable-next-line: variable-name
export const tokens__by__instance = Index({
  name: BiotaIndexName('tokens__by__instance'),
  source: {
    collection: q.Tokens(),
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
