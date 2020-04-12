import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanRole = UDFunction({
  name: BiotaFunctionName('CleanRole'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], cleanFQLUDF.role(q.Var('name') as any))),
});
