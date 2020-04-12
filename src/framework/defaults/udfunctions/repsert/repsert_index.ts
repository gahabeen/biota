import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { repsert as repsertFQLUDF } from '~/factory/api/fql/udf/repsert';

export const RepsertIndex = UDFunction({
  name: BiotaFunctionName('RepsertIndex'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], repsertFQLUDF.index(q.Var('name') as any, q.Var('options') as any)),
  ),
});
