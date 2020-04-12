import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { upsert as upsertFQLUDF } from '~/factory/api/fql/udf/upsert';

export const UpsertCollection = UDFunction({
  name: BiotaFunctionName('UpsertCollection'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], upsertFQLUDF.collection(q.Var('name') as any, q.Var('options') as any)),
  ),
});
