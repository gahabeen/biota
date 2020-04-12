import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { repsert as repsertFQLUDF } from '~/factory/api/fql/udf/repsert';

export const RepsertToken = UDFunction({
  name: BiotaFunctionName('RepsertToken'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], repsertFQLUDF.token(q.Var('id') as any, q.Var('options') as any))),
});
