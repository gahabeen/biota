import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { replace as replaceFQLUDF } from '~/factory/api/fql/udf/replace';

export const ReplaceRole = UDFunction({
  name: BiotaFunctionName('ReplaceRole'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], replaceFQLUDF.role(q.Var('name') as any, q.Var('options') as any)),
  ),
});
