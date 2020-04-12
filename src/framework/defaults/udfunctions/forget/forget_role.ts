import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { forget as forgetFQLUDF } from '~/factory/api/fql/udf/forget';

export const ForgetRole = UDFunction({
  name: BiotaFunctionName('ForgetRole'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], forgetFQLUDF.role(q.Var('name') as any))),
});
