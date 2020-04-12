import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { delete_ as deleteFQLUDF } from '~/factory/api/fql/udf/delete';

export const DeleteIndex = UDFunction({
  name: BiotaFunctionName('DeleteIndex'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], deleteFQLUDF.index(q.Var('name') as any))),
});
