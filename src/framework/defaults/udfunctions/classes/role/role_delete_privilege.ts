import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { role as roleFQLUDF } from '~/factory/api/fql/udf/role';

export const RoleDeletePrivilege = UDFunction({
  name: BiotaFunctionName('RoleDeletePrivilege'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'resource'], roleFQLUDF.privilege.delete(q.Var('name') as string, q.Var('resource'))),
  ),
});
