import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { upsert as upsertFQLUDF } from '~/factory/api/fql/udf/upsert';

export const UpsertUDFunction = UDFunction({
  name: BiotaFunctionName('UpsertUDFunction'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], upsertFQLUDF.udfunction(q.Var('name') as any, q.Var('options') as any)),
  ),
});
