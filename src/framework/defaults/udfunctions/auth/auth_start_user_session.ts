import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { BiotaRoleName } from '~/factory/classes/role';
import { BiotaCollectionName } from '~/factory/classes/collection';
import { CallIsPrivateKeyValid } from '~/framework/helpers/call_functions';

export const AuthStartUserSession = UDFunction({
  name: BiotaFunctionName('AuthStartUserSession'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'user', 'delayInMs'], // 'password',
      q.Let(
        {
          allowOperation: CallIsPrivateKeyValid(null, q.Var('private_key')),
          // valid: q.If(q.IsRef(q.Var('user')), q.Identify(q.Var('user'), q.Var('password')), false),
          expire_at: q.If(
            q.IsNull(q.Var('delayInMs')),
            q.TimeAdd(q.Now(), 1, 'hours'),
            q.TimeAdd(q.Now(), q.ToNumber(q.Var('delayInMs')), 'milliseconds'),
          ),
        },
        // q.If(
        //   q.Var('valid'),
        q.Let(
          {
            session: q.Create(q.Collection(BiotaCollectionName('user_sessions')), {
              data: {
                _membership: {
                  owner: q.Var('user'),
                },
                _activity: {
                  created_at: q.Now(),
                  created_by: q.Var('user'),
                  expire_at: q.Var('expire_at'),
                },
              },
            }),
            token: q.Create(q.Tokens(), { instance: q.Select('ref', q.Var('session'), null) }),
          },
          q.Select('secret', q.Var('token'), false),
        ),
        // false,
        // ),
      ),
    ),
  ),
  role: q.Role(BiotaRoleName('system')),
});
