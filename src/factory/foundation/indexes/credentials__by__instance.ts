import { query as q } from 'faunadb';
import { Index, indexNameNormalized } from '~/factory/classes/index';

// tslint:disable-next-line: variable-name
export const credentials__by__instance = Index({
  name: indexNameNormalized('credentials__by__instance'),
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
