import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { replace as replaceFQLUDF } from '~/factory/api/fql/udf/replace';

export const ReplaceDocument = UDFunction({
  name: BiotaFunctionName('ReplaceDocument'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'data'],
      replaceFQLUDF.document(q.Var('collection') as any, q.Var('id') as any, q.Var('data') as any),
    ),
  ),
});
