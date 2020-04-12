import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const UserLogout = UDFunction({
  name: BiotaFunctionName('UserLogout'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'everywhere'], userFQLUDF.logout(q.Var('everywhere') as any))),
});
