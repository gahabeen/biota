import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { upsert as upsertFQLUDF } from '~/factory/api/fql/udf/upsert';

export const UpsertToken = UDFunction({
  name: udfunctionNameNormalized('UpsertToken'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], upsertFQLUDF.token(q.Var('id') as any, q.Var('options') as any))),
});
