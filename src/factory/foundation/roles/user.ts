import { Expr, query as q } from 'faunadb';
import { TS_2500_YEARS } from '~/consts';
import { Identity } from '~/factory/api/ql';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { CustomPrivilege, PrivilegeRights } from '~/factory/constructors/privilege';
import { BiotaRoleName, Role } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';

// tslint:disable-next-line: variable-name
const is_document_available = q.Let(
  {
    deleted_at: q.Select(['data', '_activity', 'deleted_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS)),
    forgotten_at: q.Select(['data', '_activity', 'forgotten_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS)),
    expired_at: q.Select(['data', '_activity', 'expired_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS)),
  },
  q.GTE(
    q.If(
      q.LTE(q.Var('deleted_at'), q.Var('forgotten_at'), q.Var('expired_at')),
      q.Var('deleted_at'),
      q.If(q.LTE(q.Var('forgotten_at'), q.Var('expired_at'), q.Var('deleted_at')), q.Var('forgotten_at'), q.Var('expired_at')),
    ),
    q.Now(),
  ),
);

// tslint:disable-next-line: variable-name
const has_role = (doc: Expr, role: string) =>
  q.GT(q.Filter(q.Select(['data', '_membership', 'roles'], doc, []), q.Lambda(['role'], q.Equals(q.Role(role), q.Var('role')))), 0);

export const user: FaunaRoleOptions = Role({
  name: BiotaRoleName('user'),
  membership: [
    {
      resource: q.Collection(BiotaCollectionName('user_sessions')),
      predicate: q.Query(
        q.Lambda(
          'ref',
          q.Let(
            {
              doc: q.Get(q.Var('ref')),
              is_valid: is_document_available,
            },
            q.If(
              q.Var('is_valid'),
              q.Let(
                {
                  user: q.Get(q.Select(['data', '_membership', 'owner'], q.Var('doc'), null)),
                },
                has_role(q.Var('user'), BiotaRoleName('user')),
              ),
              false,
            ),
          ),
        ),
      ),
    },
  ],
  privileges: [
    /**
     * Indexes
     */

    /**
     * Collections
     */

    CustomPrivilege({
      resource: q.Collection(BiotaCollectionName('actions')),
      actions: {
        read: q.Query(
          q.Lambda(
            'ref',
            q.Let(
              {
                user: q.Select(['data', 'user'], q.Get(q.Var('ref'))),
              },
              q.If(q.IsRef(q.Var('user')), q.Equals(q.Var('user'), Identity()), false),
            ),
          ),
        ),
      },
    }),

    PrivilegeRights({
      resource: q.Collection(BiotaCollectionName('users')),
      rights: {
        get: ['self', 'owner', 'assignee'],
        update: ['self', 'owner', 'assignee'],
      },
    }),

    PrivilegeRights({
      resource: q.Collection(BiotaCollectionName('user_sessions')),
      rights: {
        get: ['self', 'owner', 'assignee'],
        update: ['self', 'owner', 'assignee'],
      },
    }),

    /**
     * Functions
     */

    // CustomPrivilege({
    //   resource: q.Function(BiotaFunctionName('SearchQuery')),
    //   actions: { call: true },
    // }),
  ],
});
