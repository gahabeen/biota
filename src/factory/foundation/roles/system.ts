import { query as q } from 'faunadb';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';
import { BiotaIndexName } from '~/factory/constructors';
import { BiotaCollectionName, BiotaFunctionName } from '~/factory/api/constructors';

export const auth: FaunaRoleOptions = {
  name: BiotaRoleName('system'),
  privileges: [
    Privilege({
      resource: q.Functions(),
      actions: { read: true },
    }),
    Privilege({
      resource: q.Index(BiotaIndexName('users__by__auth_email')),
      actions: { unrestricted_read: true },
    }),
    Privilege({
      resource: q.Tokens(),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Credentials(),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('actions')),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('user_sessions')),
      actions: { create: true, write: true, read: true },
    }),
    Privilege({
      resource: q.Collection(BiotaCollectionName('users')),
      actions: { create: true, write: true, read: true },
    }),
  ],
};
