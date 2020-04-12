import { query as q } from 'faunadb';
import { Index, indexNameNormalized } from '~/factory/classes/index';

// tslint:disable-next-line: variable-name
export const tokens__by__instance = Index({
  name: indexNameNormalized('tokens__by__instance'),
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
