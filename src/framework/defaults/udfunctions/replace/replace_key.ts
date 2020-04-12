import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { replace as replaceFQLUDF } from '~/factory/api/fql/udf/replace';

export const ReplaceKey = UDFunction({
  name: BiotaFunctionName('ReplaceKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], replaceFQLUDF.key(q.Var('id') as any, q.Var('options') as any))),
});
