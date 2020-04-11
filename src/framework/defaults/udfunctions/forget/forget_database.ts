import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { forget as forgetFQLUDF } from '~/factory/api/fql/udf/forget';

export const ForgetDatabase = UDFunction({
  name: udfunctionNameNormalized('ForgetDatabase'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], forgetFQLUDF.database(q.Var('name') as any))),
});
