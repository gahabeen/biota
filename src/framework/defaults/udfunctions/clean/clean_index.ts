import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanIndex = UDFunction({
  name: BiotaFunctionName('CleanIndex'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], cleanFQLUDF.index(q.Var('name') as any))),
});
