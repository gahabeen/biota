import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { forget as forgetFQLUDF } from '~/factory/api/fql/udf/forget';

export const ForgetIndex = UDFunction({
  name: BiotaFunctionName('ForgetIndex'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], forgetFQLUDF.index(q.Var('name') as any))),
});
