import { query as q } from 'faunadb';
import { BiotaCollectionName } from '~/factory/api/constructors';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';

export const system: FaunaRoleOptions = {
  name: BiotaRoleName('secure_user'),
  membership: [
    {
      resource: q.Collection(BiotaCollectionName('users')),
    },
  ],
  privileges: [
    Privilege({
      resource: q.Collection(BiotaCollectionName('sessions')),
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
