import { query as q } from 'faunadb';
import { DBFactorySpecificUserApi } from '~/../types/factory/factory.specific.user';
import * as call from '~/factory/api/call';
import { indexNameNormalized } from '~/factory/classes';
import { udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { CallLogAction, CallSystemOperator } from '~/framework/helpers/call_functions';
import { collectionNameNormalized } from '~/factory/classes/collection';
import { update as updateBaseFQL } from '~/factory/api/fql/base/update';
import { Identity } from '../../ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { PAGINATION_SIZE_MAX } from '~/consts';
import { user as userFQLBase } from '~/factory/api/fql/base/user';

export const user: DBFactorySpecificUserApi = {
  login(email, password) {
    return q.Let(
      {
        doc: q.Select(0, q.Paginate(q.Match(q.Index(indexNameNormalized('users__by__email')), email)), {}),
        logged: q.If(
          q.IsRef(q.Var('doc')),
          {
            secret: q.Call(
              udfunctionNameNormalized('AuthStartUserSession'),
              q.Var('doc'),
              q.Var('private_key'),
              q.Var('doc'),
              password,
              null,
            ),
          },
          { secret: false },
        ),
      },
      q.If(
        q.IsString(q.Select('secret', q.Var('logged'))),
        q.Let(
          {
            action: CallLogAction('login', q.Var('doc')),
          },
          q.Var('logged'),
        ),
        q.Let(
          {
            action: CallLogAction('login_failed', q.Var('doc')),
          },
          q.Var('logged'),
        ),
      ),
    );
  },
  loginWithAuthAccount(account) {
    return q.Let(
      {
        accountValid: q.If(
          q.And(q.IsString(q.Select('id', account, null)), q.IsString(q.Select('provider', account, null))),
          true,
          q.Abort("Auth Account isn't valid"),
        ),
        doc: q.Select(
          0,
          q.Paginate(
            q.Match(q.Index(indexNameNormalized('users__by__auth_account')), [
              q.Select('provider', account, null),
              q.Select('id', account, null),
            ]),
          ),
          {},
        ),
        logged: q.If(
          q.IsRef(q.Var('doc')),
          {
            secret: q.Call(
              udfunctionNameNormalized('AuthStartUserSession'),
              q.Var('doc'),
              q.Var('private_key'),
              q.Var('doc'),
              // password,
              null,
            ),
          },
          { secret: false },
        ),
      },
      q.If(
        q.IsString(q.Select('secret', q.Var('logged'))),
        q.Let(
          {
            action: CallLogAction('login', q.Var('doc')),
          },
          q.Var('logged'),
        ),
        q.Let(
          {
            action: CallLogAction('login_failed', q.Var('doc')),
          },
          q.Var('logged'),
        ),
      ),
    );
  },
  logout(everywhere) {
    return q.If(
      q.HasIdentity(),
      q.If(
        everywhere,
        q.Map(
          q.Paginate(
            q.Call(udfunctionNameNormalized('SearchQuery'), Identity(), q.Collection(collectionNameNormalized('user_sessions')), {
              '_membership.owner': Identity(),
            }),
            { size: PAGINATION_SIZE_MAX },
          ),
          q.Lambda(
            ['session'],
            q.Call(
              udfunctionNameNormalized('DeleteDocument'),
              Identity(),
              q.Var('private_key'),
              collectionNameNormalized('user_sessions'),
              q.Select('id', q.Var('session')),
            ),
          ),
        ),
        q.Call(
          udfunctionNameNormalized('DeleteDocument'),
          Identity(),
          q.Var('private_key'),
          collectionNameNormalized('user_sessions'),
          q.Select('id', q.Identity()),
        ),
      ),
      false,
    );
  },
  register(email, password, data = {}) {
    return q.Let(
      {
        doc: q.Call(
          udfunctionNameNormalized('InsertDocument'),
          Identity(),
          q.Var('private_key'),
          collectionNameNormalized('users'),
          data,
          null,
        ),
        operation: CallSystemOperator(
          updateBaseFQL.document(collectionNameNormalized('users'), q.Select(['ref', 'id'], q.Var('doc')), {
            _auth: {
              email,
            },
            _membership: {
              owner: q.Select('ref', q.Var('doc')),
              roles: ['biota.user'],
            },
            _activity: {
              created_by: q.Select('ref', q.Var('doc')),
            },
          }),
          q.Select('ref', q.Var('doc')),
        ),
        with_credentials: q.Call(
          udfName('UpdateCredentials'),
          Identity(),
          q.Var('private_key'),
          collectionNameNormalized('users'),
          q.Select(['ref', 'id'], q.Var('doc')),
          { password },
        ),
        action: CallLogAction('register', q.Var('doc')),
      },
      q.Call(udfunctionNameNormalized('UserLogin'), Identity(), q.Var('private_key'), email, password),
    );
  },
  registerWithAuthAccount(account) {
    return q.Let(
      {
        account,
        doc: q.Call(
          udfunctionNameNormalized('InsertDocument'),
          Identity(),
          q.Var('private_key'),
          collectionNameNormalized('users'),
          {},
          null,
        ),
        upsert_auth_account: q.Call(
          udfunctionNameNormalized('UserAuthAccountUpsert'),
          Identity(),
          q.Var('private_key'),
          q.Select(['ref', 'id'], q.Var('doc'), null),
          q.Var('account'),
        ),
        operation: CallSystemOperator(
          updateBaseFQL.document(collectionNameNormalized('users'), q.Select(['ref', 'id'], q.Var('doc')), {
            _membership: {
              owner: q.Select('ref', q.Var('doc')),
              roles: ['biota.user'],
            },
            _activity: {
              created_by: q.Select('ref', q.Var('doc')),
            },
          }),
          q.Select('ref', q.Var('doc')),
        ),
        action: CallLogAction('register', q.Var('doc')),
      },
      q.Call(udfunctionNameNormalized('UserLoginWithAuthAccount'), Identity(), q.Var('private_key'), q.Var('account')),
    );
  },
  changePassword(newPassword) {
    return call.update.credentials(q.Select('collection', q.Identity()) as string, q.Select('id', q.Identity()), { password: newPassword });
  },
  auth: {
    account: {
      upsert(id, account) {
        return q.Let(
          {
            validAccount: q.And(q.IsString(q.Select('id', account, null)), q.IsString(q.Select('provider', account, null))),
          },
          q.If(
            q.Var('validAccount'),
            q.Let(
              {
                operation: CallSystemOperator(userFQLBase.auth.account.upsert(collectionNameNormalized('users'), id, account)),
                action: CallLogAction('upsert', q.Var('operation')),
              },
              q.Var('operation'),
            ),
            // #improve maybe log failed upsert?
            false,
          ),
        );
      },
      repsert(id, account) {
        return q.Let(
          {
            validAccount: q.And(q.IsString(q.Select('id', account, null)), q.IsString(q.Select('provider', account, null))),
          },
          q.If(
            q.Var('validAccount'),
            q.Let(
              {
                operation: CallSystemOperator(userFQLBase.auth.account.repsert(collectionNameNormalized('users'), id, account)),
                action: CallLogAction('repsert', q.Var('operation')),
              },
              q.Var('operation'),
            ),
            // #improve maybe log failed upsert?
            false,
          ),
        );
      },
      delete(id, provider, accountId) {
        return q.Let(
          {
            operation: CallSystemOperator(userFQLBase.auth.account.delete(collectionNameNormalized('users'), id, provider, accountId)),
            action: CallLogAction('upsert', q.Var('operation')),
          },
          q.Var('operation'),
        );
      },
    },
  },
};
