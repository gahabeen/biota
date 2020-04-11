import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateDatabase = UDFunction({
  name: udfunctionNameNormalized('UpdateDatabase'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], updateFQLUDF.database(q.Var('name') as any, q.Var('options') as any)),
  ),
});
