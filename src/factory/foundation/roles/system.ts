import { query as q } from 'faunadb';
import { FaunaRoleOptions } from '~/../types/fauna';
import { indexNameNormalized } from '~/factory/classes/index';
import { Privilege, roleNameNormalized } from '~/factory/classes/role';
import { udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { collectionNameNormalized } from '~/factory/classes/collection';

export const system: FaunaRoleOptions = {
  name: roleNameNormalized('system'),
  privileges: [
    /**
     * Collections
     */

    Privilege({
      resource: q.Indexes(),
      actions: { read: 'all', unrestricted_read: 'all' },
    }),

    Privilege({
      resource: q.Collection(collectionNameNormalized('users')),
      actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    }),

    Privilege({
      resource: q.Collection(collectionNameNormalized('actions')),
      actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    }),

    Privilege({
      resource: q.Collection(collectionNameNormalized('user_sessions')),
      actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    }),

    Privilege({
      resource: q.Tokens(),
      actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    }),

    /**
     * Indexes
     */

    Privilege({
      resource: q.Index(indexNameNormalized('indexes__by__resource')),
      actions: { read: 'all', unrestricted_read: 'all' },
    }),

    Privilege({
      resource: q.Index(indexNameNormalized('indexes__by__terms')),
      actions: { read: 'all', unrestricted_read: 'all' },
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(udfunctionNameNormalized('FindIndex')),
      actions: { call: 'all' },
    }),

    Privilege({
      resource: q.Function(udfunctionNameNormalized('IsPrivateKeyValid')),
      actions: { call: 'all' },
    }),
  ],
};
