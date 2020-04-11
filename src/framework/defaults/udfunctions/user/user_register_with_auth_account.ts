import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';

export const UserRegisterWithAuthAccount = UDFunction({
  name: udfunctionNameNormalized('UserRegisterWithAuthAccount'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'account'], userFQLUDF.registerWithAuthAccount(q.Var('account') as any))),
});
