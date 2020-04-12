import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanToken = UDFunction({
  name: BiotaFunctionName('CleanToken'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id'], cleanFQLUDF.token(q.Var('id') as any))),
});
