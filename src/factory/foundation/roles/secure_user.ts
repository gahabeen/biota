import { query as q } from 'faunadb';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';
import { BiotaIndexName } from '~/factory/constructors';
import { BiotaCollectionName } from '~/factory/api/constructors';

export const system: FaunaRoleOptions = {
  name: BiotaRoleName('secure_user'),
  membership: [
    {
      resource: q.Collection(BiotaCollectionName('users')),
    },
  ],
  privileges: [
    Privilege({
      resource: q.Collection(BiotaCollectionName('users_session')),
      rights: {
        insert: ['owner'],
      },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('users')),
      actions: {
        create: false,
        read: true,
        write: false,
        history_read: false,
        history_write: false,
      },
    }),
  ],
};
