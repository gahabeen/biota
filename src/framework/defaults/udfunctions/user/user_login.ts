import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const UserLogin = UDFunction({
  name: BiotaFunctionName('UserLogin'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'email', 'password'], userFQLUDF.login(q.Var('email') as string, q.Var('password') as string)),
  ),
});
