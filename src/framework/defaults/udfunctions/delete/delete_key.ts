import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { delete_ as deleteFQLUDF } from '~/factory/api/fql/udf/delete';

export const DeleteKey = UDFunction({
  name: BiotaFunctionName('DeleteKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id'], deleteFQLUDF.key(q.Var('id') as any))),
});
