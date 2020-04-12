import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { BiotaRoleName } from '~/factory/classes/role';
import { CallIsPrivateKeyValid } from '~/framework/helpers/call_functions';

export const SystemOperator = UDFunction({
  name: BiotaFunctionName('SystemOperator'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'query'], q.Do(CallIsPrivateKeyValid(q.Var('identity'), q.Var('private_key')), q.Var('query'))),
  ),
  role: q.Role(BiotaRoleName('system')),
});
