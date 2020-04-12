import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanKey = UDFunction({
  name: BiotaFunctionName('CleanKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id'], cleanFQLUDF.key(q.Var('id') as any))),
});
