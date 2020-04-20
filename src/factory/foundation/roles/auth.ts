import { query as q } from 'faunadb';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';
import { BiotaIndexName } from '~/factory/constructors';
import { BiotaCollectionName } from '~/factory/api/constructors';

export const system: FaunaRoleOptions = {
  name: BiotaRoleName('auth'),
  privileges: [
    Privilege({
      resource: q.Index(BiotaIndexName('users__by__auth_email')),
      actions: { unrestricted_read: true },
    }),
    Privilege({
      resource: q.Credentials(),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('actions')),
      actions: { create: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('sessions')),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('users')),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('users_sessions')),
      actions: { create: true, write: true, read: true },
    }),
  ],
};
