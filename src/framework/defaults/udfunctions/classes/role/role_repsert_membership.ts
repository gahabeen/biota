import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { role as roleFQLUDF } from '~/factory/api/fql/udf/role';

export const RoleRepsertMembership = UDFunction({
  name: udfunctionNameNormalized('RoleRepsertMembership'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'name', 'membership'],
      roleFQLUDF.membership.repsert(q.Var('name') as string, q.Var('membership')),
    ),
  ),
});
