import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { insert as insertFQLUDF } from '~/factory/api/fql/udf/insert';

export const InsertCollection = UDFunction({
  name: BiotaFunctionName('InsertCollection'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options', 'id'], insertFQLUDF.collection(q.Var('name') as any, q.Var('options') as any)),
  ),
});
