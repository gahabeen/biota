import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { replace as replaceFQLUDF } from '~/factory/api/fql/udf/replace';

export const ReplaceToken = UDFunction({
  name: udfunctionNameNormalized('ReplaceToken'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], replaceFQLUDF.token(q.Var('id') as any, q.Var('options') as any))),
});
