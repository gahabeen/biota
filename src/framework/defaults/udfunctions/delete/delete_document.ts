import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { delete_ as deleteFQLUDF } from '~/factory/api/fql/udf/delete';

export const DeleteDocument = UDFunction({
  name: BiotaFunctionName('DeleteDocument'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'collection', 'id'], deleteFQLUDF.document(q.Var('collection') as any, q.Var('id') as any)),
  ),
});
