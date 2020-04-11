import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { repsert as repsertFQLUDF } from '~/factory/api/fql/udf/repsert';

export const RepsertRole = UDFunction({
  name: udfunctionNameNormalized('RepsertRole'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], repsertFQLUDF.role(q.Var('name') as any, q.Var('options') as any)),
  ),
});
