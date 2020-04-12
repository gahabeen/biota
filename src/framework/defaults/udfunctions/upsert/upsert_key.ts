import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { upsert as upsertFQLUDF } from '~/factory/api/fql/udf/upsert';

export const UpsertKey = UDFunction({
  name: BiotaFunctionName('UpsertKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], upsertFQLUDF.key(q.Var('id') as any, q.Var('options') as any))),
});
