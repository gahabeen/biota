import { query as q } from 'faunadb';
import { FactoryContext } from 'types/factory/factory.context';
import { FactoryUser } from '~/../types/factory/factory.user';
import { document } from '~/factory/api/document';
import { collectionNameNormalized } from '../classes/collection';
import * as helpers from '~/helpers';

// tslint:disable-next-line: only-arrow-functions
export const user: FactoryContext<FactoryUser> = function (contextExpr): FactoryUser {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRef) => {
    const userApi = user(contextExpr);
    const ref = q.If(q.IsDoc(idOrRef), idOrRef, q.Ref(q.Collection(collectionNameNormalized('users')), idOrRef));

    return {
      ...document(contextExpr)(ref),
      login(email, password) {
        return {};
        // return q.Let(
        //   {
        //     doc: q.Select(0, q.Paginate(q.Match(q.Index(indexNameNormalized('users__by__email')), email)), {}),
        //     logged: q.If(
        //       q.IsRef(q.Var('doc')),
        //       {
        //         secret: q.Call(
        //           udfunctionNameNormalized('AuthStartUserSession'),
        //           q.Var('doc'),
        //           q.Var('private_key'),
        //           q.Var('doc'),
        //           password,
        //           null,
        //         ),
        //       },
        //       { secret: false },
        //     ),
        //   },
        //   q.If(
        //     q.IsString(q.Select('secret', q.Var('logged'))),
        //     q.Let(
        //       {
        //         action: CallLogAction('login', q.Var('doc')),
        //       },
        //       q.Var('logged'),
        //     ),
        //     q.Let(
        //       {
        //         action: CallLogAction('login_failed', q.Var('doc')),
        //       },
        //       q.Var('logged'),
        //     ),
        //   ),
        // );
      },
      loginWithAuthAccount(account) {
        return {};
        // return q.Let(
        //   {
        //     accountValid: q.If(
        //       q.And(q.IsString(q.Select('id', account, null)), q.IsString(q.Select('provider', account, null))),
        //       true,
        //       q.Abort("Auth Account isn't valid"),
        //     ),
        //     doc: q.Select(
        //       0,
        //       q.Paginate(
        //         q.Match(q.Index(indexNameNormalized('users__by__auth_account')), [
        //           q.Select('provider', account, null),
        //           q.Select('id', account, null),
        //         ]),
        //       ),
        //       {},
        //     ),
        //     logged: q.If(
        //       q.IsRef(q.Var('doc')),
        //       {
        //         secret: q.Call(
        //           udfunctionNameNormalized('AuthStartUserSession'),
        //           q.Var('doc'),
        //           q.Var('private_key'),
        //           q.Var('doc'),
        //           // password,
        //           null,
        //         ),
        //       },
        //       { secret: false },
        //     ),
        //   },
        //   q.If(
        //     q.IsString(q.Select('secret', q.Var('logged'))),
        //     q.Let(
        //       {
        //         action: CallLogAction('login', q.Var('doc')),
        //       },
        //       q.Var('logged'),
        //     ),
        //     q.Let(
        //       {
        //         action: CallLogAction('login_failed', q.Var('doc')),
        //       },
        //       q.Var('logged'),
        //     ),
        //   ),
        // );
      },
      logout(everywhere) {
        return {};
        // return q.If(
        //   q.HasIdentity(),
        //   q.If(
        //     everywhere,
        //     q.Map(
        //       q.Paginate(
        //         q.Call(udfunctionNameNormalized('SearchQuery'), Identity(), q.Collection(collectionNameNormalized('user_sessions')), {
        //           '_membership.owner': Identity(),
        //         }),
        //         { size: PAGINATION_SIZE_MAX },
        //       ),
        //       q.Lambda(
        //         ['session'],
        //         q.Call(
        //           udfunctionNameNormalized('DeleteDocument'),
        //           Identity(),
        //           q.Var('private_key'),
        //           collectionNameNormalized('user_sessions'),
        //           q.Select('id', q.Var('session')),
        //         ),
        //       ),
        //     ),
        //     q.Call(
        //       udfunctionNameNormalized('DeleteDocument'),
        //       Identity(),
        //       q.Var('private_key'),
        //       collectionNameNormalized('user_sessions'),
        //       q.Select('id', q.Identity()),
        //     ),
        //   ),
        //   false,
        // );
      },
      register(email, password, data = {}) {
        return {};
        // return q.Let(
        //   {
        //     doc: q.Call(
        //       udfunctionNameNormalized('InsertDocument'),
        //       Identity(),
        //       q.Var('private_key'),
        //       collectionNameNormalized('users'),
        //       data,
        //       null,
        //     ),
        //     operation: CallSystemOperator(
        //       updateBaseFQL.document(collectionNameNormalized('users'), q.Select(['ref', 'id'], q.Var('doc')), {
        //         _auth: {
        //           email,
        //         },
        //         _membership: {
        //           owner: q.Select('ref', q.Var('doc')),
        //           roles: ['biota.user'],
        //         },
        //         _activity: {
        //           created_by: q.Select('ref', q.Var('doc')),
        //         },
        //       }),
        //       q.Select('ref', q.Var('doc')),
        //     ),
        //     with_credentials: q.Call(
        //       udfName('UpdateCredentials'),
        //       Identity(),
        //       q.Var('private_key'),
        //       collectionNameNormalized('users'),
        //       q.Select(['ref', 'id'], q.Var('doc')),
        //       { password },
        //     ),
        //     action: CallLogAction('register', q.Var('doc')),
        //   },
        //   q.Call(udfunctionNameNormalized('UserLogin'), Identity(), q.Var('private_key'), email, password),
        // );
      },
      registerWithAuthAccount(account) {
        return {};
        // return q.Let(
        //   {
        //     account,
        //     doc: q.Call(
        //       udfunctionNameNormalized('InsertDocument'),
        //       Identity(),
        //       q.Var('private_key'),
        //       collectionNameNormalized('users'),
        //       {},
        //       null,
        //     ),
        //     upsert_auth_account: q.Call(
        //       udfunctionNameNormalized('UserAuthAccountUpsert'),
        //       Identity(),
        //       q.Var('private_key'),
        //       q.Select(['ref', 'id'], q.Var('doc'), null),
        //       q.Var('account'),
        //     ),
        //     operation: CallSystemOperator(
        //       updateBaseFQL.document(collectionNameNormalized('users'), q.Select(['ref', 'id'], q.Var('doc')), {
        //         _membership: {
        //           owner: q.Select('ref', q.Var('doc')),
        //           roles: ['biota.user'],
        //         },
        //         _activity: {
        //           created_by: q.Select('ref', q.Var('doc')),
        //         },
        //       }),
        //       q.Select('ref', q.Var('doc')),
        //     ),
        //     action: CallLogAction('register', q.Var('doc')),
        //   },
        //   q.Call(udfunctionNameNormalized('UserLoginWithAuthAccount'), Identity(), q.Var('private_key'), q.Var('account')),
        // );
      },
      changePassword(newPassword) {
        return {};
        // return call.update.credentials(q.Select('collection', q.Identity()) as string, q.Select('id', q.Identity()), {
        //   password: newPassword,
        // });
      },
      auth: {
        email: {
          set(email) {
            return q.If(
              q.IsString(email),
              userApi(ref).upsert({
                _auth: {
                  email,
                },
              }),
              false,
            );
          },
          remove() {
            return userApi(ref).upsert({
              _auth: {
                email: null,
              },
            });
          },
        },
        accounts: {
          distinct(account) {
            return q.Let(
              {
                provider: q.Select('provider', account, null),
                accountId: q.Select('id', account, null),
                current_accounts: q.Select(['data', '_auth', 'accounts'], q.Get(ref), []),
                same_current_account: q.Filter(
                  q.Var('current_accounts'),
                  q.Lambda(
                    'ca',
                    q.And(
                      q.Equals(q.Select('provider', q.Var('ca')), q.Var('provider')),
                      q.Equals(q.Select('id', q.Var('ca')), q.Var('accountId')),
                    ),
                  ),
                ),
                current_accounts_without_new: q.Filter(
                  q.Var('current_accounts'),
                  q.Lambda(
                    'ca',
                    q.Not(
                      q.And(
                        q.Equals(q.Select('provider', q.Var('ca')), q.Var('provider')),
                        q.Equals(q.Select('id', q.Var('ca')), q.Var('accountId')),
                      ),
                    ),
                  ),
                ),
                new_account: q.Merge(q.Select(0, q.Var('same_current_account'), {}), account),
                new_accounts: q.Append(q.Var('current_accounts_without_new'), [q.Var('new_account')]),
              },
              q.Var('new_accounts'),
            );
          },
          difference(provider, accountId) {
            return q.Let(
              {
                current_accounts: q.Select(['data', '_auth', 'accounts'], q.Get(ref), []),
                filtered_accounts: q.Filter(
                  q.Var('current_accounts'),
                  q.Lambda(
                    'ca',
                    q.Not(q.And(q.Equals(q.Select('provider', q.Var('ca')), provider), q.Equals(q.Select('id', q.Var('ca')), accountId))),
                  ),
                ),
              },
              q.Var('filtered_accounts'),
            );
          },
          set(account) {
            return userApi(ref).upsert({
              _auth: {
                accounts: userApi(ref).auth.accounts.distinct(account),
              },
            });
          },
          remove(provider, accountId) {
            return userApi(ref).upsert({
              _auth: {
                accounts: userApi(ref).auth.accounts.difference(provider, accountId),
              },
            });
          },
        },
      },
      membership: {
        role(roleOrRef) {
          const roleRef = q.If(q.IsRole(roleOrRef), roleOrRef, q.Role(roleOrRef));
          return {
            distinct() {
              return q.Distinct(q.Union(q.Select(helpers.path('_membership.roles'), q.Get(ref), []), [roleRef]));
            },
            difference() {
              return q.Difference(q.Select(helpers.path('_membership.roles'), q.Get(ref), []), [roleRef]);
            },
            set() {
              return userApi(ref).upsert({
                _membership: {
                  roles: userApi(ref).membership.role(roleRef).distinct(),
                },
              });
            },
            remove() {
              return userApi(ref).upsert({
                _membership: {
                  roles: userApi(ref).membership.role(roleRef).difference(),
                },
              });
            },
          };
        },
        owner: {
          // tslint:disable-next-line: no-shadowed-variable
          set(user) {
            return q.If(
              q.IsDoc(user),
              userApi(ref).upsert({
                _membership: {
                  owner: user,
                },
              }),
              false,
            );
          },
          remove() {
            return userApi(ref).upsert({
              _membership: {
                owner: null,
              },
            });
          },
        },
        assignee(assignee) {
          const assigneeRef = q.If(q.IsDoc(assignee), assignee, null);
          return {
            distinct() {
              return q.Distinct(q.Union(q.Select(helpers.path('_membership.assignees'), q.Get(ref), []), [assigneeRef]));
            },
            difference() {
              return q.Difference(q.Select(helpers.path('_membership.assignees'), q.Get(ref), []), [assigneeRef]);
            },
            set() {
              return userApi(ref).upsert({
                _membership: {
                  assignees: userApi(ref).membership.role(assigneeRef).distinct(),
                },
              });
            },
            remove() {
              return userApi(ref).upsert({
                _membership: {
                  assignees: userApi(ref).membership.role(assigneeRef).difference(),
                },
              });
            },
          };
        },
      },
    };
  };
};
