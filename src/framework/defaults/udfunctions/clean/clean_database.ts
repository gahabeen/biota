import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanDatabase = UDFunction({
  name: BiotaFunctionName('CleanDatabase'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], cleanFQLUDF.database(q.Var('name') as any))),
});
