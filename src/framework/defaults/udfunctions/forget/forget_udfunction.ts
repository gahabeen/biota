import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { forget as forgetFQLUDF } from '~/factory/api/fql/udf/forget';

export const ForgetUDFunction = UDFunction({
  name: udfunctionNameNormalized('ForgetUDFunction'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], forgetFQLUDF.udfunction(q.Var('name') as any))),
});
