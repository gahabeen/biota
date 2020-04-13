import { query as q } from 'faunadb';
import { FactoryContext } from 'types/factory/factory.context';
import { FactoryUser } from '~/../types/factory/factory.user';
import { PAGINATION_SIZE_MAX } from '~/consts';
import { document } from '~/factory/api/document';
import { indexes } from '~/factory/api/indexes';
import { action } from '~/factory/api/action';
import { users } from '~/factory/api/users';
import { userSession } from '~/factory/api/userSession';
import { credential } from '~/factory/api/credential';
import { BiotaCollectionName } from '../constructors/collection';
import { ContextProp } from '../constructors/context';
import { ThrowError } from '../constructors/error';
import { BiotaRoleName } from '../constructors/role';
import { BiotaFunctionName, CallUDFunction } from '../constructors/udfunction';
import { ContextExtend } from './ql';
import { BiotaIndexName } from '../constructors';

// tslint:disable-next-line: only-arrow-functions
export const user: FactoryContext<FactoryUser> = function (contextExpr): FactoryUser {
  const offline = ContextProp(contextExpr, 'offline');
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRef) => {
    const ref = q.If(q.IsDoc(idOrRef), idOrRef, q.Ref(q.Collection(BiotaCollectionName('users')), idOrRef));

    return {
      ...document(contextExpr)(ref),
      login(email, password) {
        // #improve: add expirationDuration
        const ctx = ContextExtend(contextExpr, 'factory.user.login');
        return q.If(
          offline,
          q.Let(
            {
              user: users(ctx).getByAuthEmail(email),
              userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(ctx, "Could'nt find the user", { email })),
              identified_user: q.Identify(ContextProp(ctx, 'identity'), password),
              is_identified_user: q.If(q.Var('identified_user'), true, ThrowError(ctx, 'User email or password is wrong')),
              session: userSession(ctx)().start(q.Var('user'), null), // #improve: add expirationDuration
              action: action(ctx)('login', q.Var('user')).dispatch(),
            },
            q.Var('session'),
          ),
          CallUDFunction('UserLogin', contextExpr, { email, password }),
        );
      },
      logout(everywhere) {
        const ctx = ContextExtend(contextExpr, 'factory.user.logout');
        return q.If(
          offline,
          q.If(
            q.Or(ContextProp(ctx, 'hasSession'), ContextProp(ctx, 'hasIdentity')),
            q.If(
              everywhere,
              q.Let(
                {
                  logging_out: q.Map(
                    q.Paginate(
                      indexes(ctx).searchQuery(q.Collection(BiotaCollectionName('user_sessions')), {
                        '_membership.owner': ContextProp(ctx, 'identity'),
                      }),
                      { size: PAGINATION_SIZE_MAX },
                    ),
                    q.Lambda(['session'], document(ctx)(q.Var('session')).delete()),
                  ),
                  action: action(ctx)('logout_everywhere', q.Var('user')).dispatch(),
                },
                q.Var('logging_out'),
              ),
              q.Let(
                {
                  logging_out: document(ctx)(ContextProp(ctx, 'hasSession')).delete(),
                  action: action(ctx)('logout', q.Var('user')).dispatch(),
                },
                q.Var('logging_out'),
              ),
            ),
            ThrowError(ctx, 'Context has no identity or session', ctx),
          ),
          q.Call(BiotaFunctionName('UserLogout'), ContextExtend(contextExpr, 'udf.UserLogout'), { everywhere }),
        );
      },
      changePassword(currentPassword, password) {
        const ctx = ContextExtend(contextExpr, 'factory.user.changePassword');
        return q.If(
          offline,
          q.If(
            ContextProp(ctx, 'hasIdentity'),
            credential(ctx)(ContextProp(ctx, 'identity')).update(currentPassword, password),
            ThrowError(ctx, "Can't change password without identity", { identity: ContextProp(ctx, 'identity') }),
          ),
          CallUDFunction('UserChangePassword', contextExpr, { password }),
        );
      },
      loginWithAuthAccount(account) {
        // #improve: add expirationDuration
        const ctx = ContextExtend(contextExpr, 'factory.user.loginWithAuthAccount');
        return q.If(
          offline,
          q.Let(
            {
              accountValid: q.If(
                q.And(q.IsString(q.Select('id', account, null)), q.IsString(q.Select('provider', account, null))),
                true,
                ThrowError(ctx, "Auth Account isn't valid", { account }),
              ),
              user: users(ctx).getByAuthAccount(account),
              userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(ctx, "Could'nt find the user", { account })),
              session: userSession(ctx)().start(q.Var('user'), null), // #improve: add expirationDuration
            },
            q.Var('session'),
          ),
          CallUDFunction('UserLoginWithAuthAccount', contextExpr, { account }),
        );
      },
      register(email, password, data) {
        const ctx = ContextExtend(contextExpr, 'factory.user.register');
        return q.If(
          offline,
          q.Let(
            {
              user: user(ctx)().insert(data),
              user_email: user(ctx)(q.Var('user')).auth.email.set(email),
              user_owner: user(ctx)(q.Var('user')).membership.owner.set(q.Var('users')),
              user_user_role: user(ctx)(q.Var('user'))
                .membership.role(q.Role(BiotaRoleName('user')))
                .set(),
              user_credentials: credential(ctx)(q.Var('user')).insert(password),
              session: userSession(ctx)().start(q.Var('user'), null), // #improve: add expirationDuration
              action: action(ctx)('register', q.Var('user')).dispatch(),
            },
            q.Var('session'),
          ),
          CallUDFunction('UserRegister', contextExpr, { email, password, data }),
        );
      },
      registerWithAuthAccount(account) {
        const ctx = ContextExtend(contextExpr, 'factory.user.registerWithAuthAccount');
        return q.If(
          offline,
          q.Let(
            {
              user: user(ctx)().insert({}),
              user_auth_account: user(ctx)(q.Var('user')).auth.accounts.set(account),
              user_owner: user(ctx)(q.Var('user')).membership.owner.set(q.Var('users')),
              user_user_role: user(ctx)(q.Var('user'))
                .membership.role(q.Role(BiotaRoleName('user')))
                .set(),
              action: action(ctx)('register', q.Var('user')).dispatch(),
              session: userSession(ctx)().start(q.Var('user'), null),
            },
            q.Var('session'),
          ),
          CallUDFunction('UserRegisterWithAuthAccount', contextExpr, { account }),
        );
      },

      auth: {
        email: {
          set(email) {
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.email.set');
            return q.If(
              q.IsString(email),
              user(ctx)(ref).upsert({
                _auth: {
                  email,
                },
              }),
              false,
            );
          },
          remove() {
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.email.remove');
            return user(ctx)(ref).upsert({
              _auth: {
                email: null,
              },
            });
          },
        },
        accounts: {
          distinct(account) {
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.accounts.distinct');
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
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.accounts.difference');
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
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.accounts.set');
            return q.If(
              offline,
              user(ctx)(ref).upsert({
                _auth: {
                  accounts: user(ctx)(ref).auth.accounts.distinct(account),
                },
              }),
              CallUDFunction('UserAuthAccountsSet', contextExpr, { account }),
            );
          },
          remove(provider, accountId) {
            const ctx = ContextExtend(contextExpr, 'factory.user.auth.accounts.remove');
            return q.If(
              offline,
              user(ctx)(ref).upsert({
                _auth: {
                  accounts: user(ctx)(ref).auth.accounts.difference(provider, accountId),
                },
              }),
              CallUDFunction('UserAuthAccountsRemove', contextExpr, { provider, accountId }),
            );
          },
        },
      },
    };
  };
};
