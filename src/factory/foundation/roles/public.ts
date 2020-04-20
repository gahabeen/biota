import { query as q } from 'faunadb';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';
import { BiotaIndexName } from '~/factory/constructors';

export const system: FaunaRoleOptions = {
  name: BiotaRoleName('public'),
  privileges: [
    Privilege({
      resource: q.Index(BiotaIndexName('users__by__auth_email')),
      actions: { unrestricted_read: 'all' },
    }),
  ],
};
