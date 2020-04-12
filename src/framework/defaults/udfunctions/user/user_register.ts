import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { BiotaRoleName } from '~/factory/classes/role';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';

export const UserRegister = UDFunction({
  name: BiotaFunctionName('UserRegister'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'email', 'password', 'data'],
      userFQLUDF.register(q.Var('email') as string, q.Var('password') as string, q.Var('data')),
    ),
  ),
});
