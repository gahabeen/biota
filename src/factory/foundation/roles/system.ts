import { query as q } from 'faunadb';
import { FaunaRoleOptions } from '~/types/fauna';
import { BiotaIndexName } from '~/factory/constructors/index';
import { BiotaRoleName } from '~/factory/constructors/role';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { PrivilegeRights } from '~/factory/constructors/privilege';

export const system: FaunaRoleOptions = {
  name: BiotaRoleName('system'),
  privileges: [
    /**
     * Collections
     */

    // PrivilegeRights({
    //   resource: q.Indexes(),
    //   actions: { read: 'all', unrestricted_read: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Collection(BiotaCollectionName('users')),
    //   actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Collection(BiotaCollectionName('actions')),
    //   actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Collection(BiotaCollectionName('user_sessions')),
    //   actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Tokens(),
    //   actions: { create: 'all', read: 'all', write: 'all', delete: 'all' },
    // }),

    // /**
    //  * Indexes
    //  */

    // PrivilegeRights({
    //   resource: q.Index(BiotaIndexName('indexes__by__resource')),
    //   actions: { read: 'all', unrestricted_read: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Index(BiotaIndexName('indexes__by__terms')),
    //   actions: { read: 'all', unrestricted_read: 'all' },
    // }),

    // /**
    //  * Functions
    //  */

    // PrivilegeRights({
    //   resource: q.Function(BiotaFunctionName('FindIndex')),
    //   actions: { call: 'all' },
    // }),

    // PrivilegeRights({
    //   resource: q.Function(BiotaFunctionName('IsPrivateKeyValid')),
    //   actions: { call: 'all' },
    // }),
  ],
};
