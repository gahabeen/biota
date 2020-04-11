import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';

export const UserAuthAccountUpsert = UDFunction({
  name: udfunctionNameNormalized('UserAuthAccountUpsert'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'id', 'account'], userFQLUDF.auth.account.upsert(q.Var('id') as string, q.Var('account') as any)),
  ),
});
