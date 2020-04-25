import { query as q } from 'faunadb';
import { PAGINATION_SIZE_MAX } from '~/consts';
import { action } from '~/factory/api/action';
import { credential } from '~/factory/api/credential';
import { document } from '~/factory/api/document';
import { indexes } from '~/factory/api/indexes';
import { session } from '~/factory/api/session';
import { users } from '~/factory/api/users';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { ContextProp } from '~/factory/constructors/context';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultData, ResultRef } from '~/factory/constructors/result';
import { BiotaRoleName } from '~/factory/constructors/role';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { DocumentAuthAccount } from '~/types/document';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryUser } from '~/types/factory/factory.user';
import { ReferenceId } from '../constructors/reference';

// tslint:disable-next-line: only-arrow-functions
export const user: FactoryContext<FactoryUser> = function (context): FactoryUser {
  // tslint:disable-next-line: only-arrow-functions
  return (id = null) => {
    return {
      ...document(context, { prefix: 'User' })(BiotaCollectionName('users'), id),
      login(email = null, password = null, expireIn = null) {
        const inputs = { email, password, expireIn };
        // ----
        const query = MethodQuery(
          {
            userRef: ResultData(users(q.Var('ctx')).getByAuthEmail(q.Var('email'))),
            userIsValid: q.If(
              q.IsDoc(q.Var('userRef')),
              true,
              ThrowError(q.Var('ctx'), "Couldn't find the user", { email: q.Var('email') }),
            ),
            identified_user: q.Identify(q.Var('userRef'), q.Var('password')),
            is_identified_user: q.If(q.Var('identified_user'), true, ThrowError(q.Var('ctx'), 'User email or password is wrong')),
            session: ResultData(session(q.Var('ctx'))().start(q.Var('expireIn'), q.Var('userRef'))),
            action: action(q.Var('ctx'))().log('login', q.Var('userRef')),
          },
          q.Var('session'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.user.login';
        const online = { name: BiotaFunctionName('UserLogin'), role: q.Role(BiotaRoleName('system')) };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      logout(everywhere = null) {
        const inputs = { everywhere };
        // ----
        const query = MethodQuery(
          {
            doc: q.If(
              q.Or(ContextProp(q.Var('ctx'), 'hasSession'), ContextProp(q.Var('ctx'), 'hasIdentity')),
              q.If(
                q.Var('everywhere'),
                q.Let(
                  {
                    logging_out: q.Map(
                      q.Paginate(
                        ResultData(
                          indexes(q.Var('ctx')).searchQuery(q.Collection(BiotaCollectionName('user_sessions')), {
                            '_membership.owner': ContextProp(q.Var('ctx'), 'identity'),
                          }),
                        ),
                        { size: PAGINATION_SIZE_MAX },
                      ),
                      q.Lambda(['session'], document(q.Var('ctx'))(q.Var('session')).delete()),
                    ),
                    action: action(q.Var('ctx'))().log('logout_everywhere', ContextProp(q.Var('ctx'), 'identity')),
                  },
                  q.Var('logging_out'),
                ),
                q.Let(
                  {
                    logging_out: ResultData(document(q.Var('ctx'))(ContextProp(q.Var('ctx'), 'hasSession')).delete()),
                    action: action(q.Var('ctx'))().log('logout', ContextProp(q.Var('ctx'), 'identity')),
                  },
                  q.Var('logging_out'),
                ),
              ),
              ThrowError(q.Var('ctx'), 'Context has no identity or session', q.Var('ctx')),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.user.logout';
        const online = { name: BiotaFunctionName('UserLogout'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      changePassword(currentPassword = null, password = null) {
        const inputs = { currentPassword, password };
        // ----
        const query = MethodQuery(
          {
            doc: q.If(
              ContextProp(q.Var('ctx'), 'hasIdentity'),
              ResultData(
                credential(q.Var('ctx'))(ContextProp(q.Var('ctx'), 'identity')).update(q.Var('currentPassword'), q.Var('password')),
              ),
              ThrowError(q.Var('ctx'), "Can't change password without identity", { identity: ContextProp(q.Var('ctx'), 'identity') }),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.user.changePassword';
        const online = { name: BiotaFunctionName('UserChangePassword'), role: q.Role(BiotaRoleName('system')) };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      /**
       * This should only be run on SERVER SIDE
       */
      loginWithAuthAccount(account = null, expireIn = null) {
        const inputs = { account, expireIn };
        // ----
        const query = MethodQuery(
          {
            accountValid: q.If(
              q.And(q.IsString(q.Select('id', q.Var('account'), null)), q.IsString(q.Select('provider', q.Var('account'), null))),
              true,
              ThrowError(q.Var('ctx'), "Auth Account isn't valid", { account: q.Var('account') }),
            ),
            userRef: ResultData(users(q.Var('ctx')).getByAuthAccount(q.Var('account'))),
            userIsValid: q.If(
              q.IsDoc(q.Var('userRef')),
              true,
              ThrowError(q.Var('ctx'), "Could'nt find the user", { account: q.Var('account') }),
            ),
            session: ResultData(session(q.Var('ctx'))().start(q.Var('expireIn'), q.Var('userRef'))),
          },
          q.Var('session'),
        );
        // ----
        const offline = 'factory.user.loginWithAuthAccount';
        const online = { name: BiotaFunctionName('UserLoginWithAuthAccount'), role: q.Role(BiotaRoleName('system')) };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      register(email = null, password = null, data = {}, expireIn = null) {
        const inputs = { email, password, data, expireIn };
        // ----
        const query = MethodQuery(
          {
            userRef: ResultRef(user(q.Var('ctx'))().insert(q.Var('data'))),
            userId: ReferenceId(q.Var('userRef')),
            user_email: ResultData(user(q.Var('ctx'))(q.Var('userId')).auth.email.set(q.Var('email'))),
            user_owner: ResultData(user(q.Var('ctx'))(q.Var('userId')).membership.owner.set(q.Var('userRef'))),
            user_user_role: ResultData(
              user(q.Var('ctx'))(q.Var('userId'))
                .membership.role(q.Role(BiotaRoleName('user')))
                .set(),
            ),
            user_credentials: ResultData(credential(q.Var('ctx'))(q.Var('userRef')).insert(q.Var('password'))),
            session: ResultData(session(q.Var('ctx'))().start(q.Var('expireIn'), q.Var('userRef'))),
            action: action(q.Var('ctx'))().log('register', q.Var('userRef')),
          },
          q.Var('session'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.user.register';
        const online = { name: BiotaFunctionName('UserRegister'), role: q.Role(BiotaRoleName('system')) };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      /**
       * This should only be run on SERVER SIDE
       */
      registerWithAuthAccount(account = null, expireIn = null) {
        const inputs = { account, expireIn };
        // ----
        const query = MethodQuery(
          {
            userRef: q.Select('ref', ResultData(user(q.Var('ctx'))(q.Collection(BiotaCollectionName('users'))).insert({})), null),
            user_auth_account: ResultData(user(q.Var('ctx'))(q.Var('userRef')).auth.account.set(q.Var('account') as DocumentAuthAccount)),
            user_owner: ResultData(user(q.Var('ctx'))(q.Var('userRef')).membership.owner.set(q.Var('userRef'))),
            user_user_role: ResultData(
              user(q.Var('ctx'))(q.Var('userRef'))
                .membership.role(q.Role(BiotaRoleName('user')))
                .set(),
            ),
            session: ResultData(session(q.Var('ctx'))().start(q.Var('expireIn'), q.Var('userRef'))),
            action: action(q.Var('ctx'))().log('register', q.Var('userRef')),
          },
          q.Var('session'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.user.registerWithAuthAccount';
        const online = { name: BiotaFunctionName('UserRegisterWithAuthAccount'), role: q.Role(BiotaRoleName('system')) };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      auth: {
        email: {
          set(email = null) {
            const inputs = { id, email };
            // ----
            const query = MethodQuery(
              {
                doc: q.If(
                  q.IsString(q.Var('email')),
                  ResultData(
                    user(q.Var('ctx'))(q.Var('id')).upsert({
                      _auth: {
                        email: q.Var('email'),
                      },
                    }),
                  ),
                  false,
                ),
              },
              q.Var('doc'),
            );
            // ----
            const offline = 'factory.user.auth.email.set';
            const online = { name: BiotaFunctionName('UserAuthEmailSet'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          remove() {
            const inputs = { id };
            // ----
            const query = MethodQuery(
              {
                doc: ResultData(
                  user(q.Var('ctx'))(q.Var('id')).upsert({
                    _auth: {
                      email: null,
                    },
                  }),
                ),
              },
              q.Var('doc'),
            );
            // ----
            const offline = 'factory.user.auth.email.remove';
            const online = { name: BiotaFunctionName('UserAuthEmailRemove'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
        },
        account: {
          distinct(account = null) {
            const inputs = { id, account };
            // ----
            const query = MethodQuery(
              {
                provider: q.Select('provider', q.Var('account'), null),
                accountId: q.Select('id', q.Var('account'), null),
                current_accounts: q.Select(
                  ['data', '_auth', 'accounts'],
                  q.Get(q.Ref(q.Collection(BiotaCollectionName('users')), q.Var('id'))),
                  [],
                ),
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
                new_account: q.Merge(q.Select(0, q.Var('same_current_account'), {}), q.Var('account')),
                new_accounts: q.Append(q.Var('current_accounts_without_new'), [q.Var('new_account')]),
              },
              q.Var('new_accounts'),
            );
            // ----
            const offline = 'factory.user.auth.accounts.distinct';
            const online = { name: BiotaFunctionName('UserAuthAccountsDistinct'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          difference(provider = null, accountId = null) {
            const inputs = { id, provider, accountId };
            // ----
            const query = MethodQuery(
              {
                current_accounts: q.Select(
                  ['data', '_auth', 'accounts'],
                  q.Get(q.Ref(q.Collection(BiotaCollectionName('users')), q.Var('id'))),
                  [],
                ),
                filtered_accounts: q.Filter(
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
              },
              q.Var('filtered_accounts'),
            );
            // ----
            const offline = 'factory.user.auth.accounts.difference';
            const online = { name: BiotaFunctionName('UserAuthAccountsDifference'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          set(account = null) {
            const inputs = { id, account };
            // ----
            const query = MethodQuery(
              {
                doc: ResultData(
                  user(q.Var('ctx'))(q.Var('id')).upsert({
                    _auth: {
                      accounts: user(q.Var('ctx'))(q.Var('id')).auth.account.distinct(q.Var('account') as DocumentAuthAccount),
                    },
                  }),
                ),
              },
              q.Var('doc'),
            );
            // ----
            const offline = 'factory.user.auth.accounts.set';
            const online = { name: BiotaFunctionName('UserAuthAccountsSet'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          remove(provider = null, accountId = null) {
            const inputs = { id, provider, accountId };
            // ----
            const query = MethodQuery(
              {
                doc: ResultData(
                  user(q.Var('ctx'))(q.Var('id')).upsert({
                    _auth: {
                      accounts: user(q.Var('ctx'))(q.Var('id')).auth.account.difference(q.Var('provider'), q.Var('accountId')),
                    },
                  }),
                ),
              },
              q.Var('doc'),
            );
            // ----
            const offline = 'factory.user.auth.accounts.remove';
            const online = { name: BiotaFunctionName('UserAuthAccountsRemove'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
        },
      },
    };
  };
};
