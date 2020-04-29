import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactorySession } from '~/types/factory/factory.session';
import { document } from '~/factory/api/document';
import { token } from '~/factory/api/token';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { ContextProp } from '~/factory/constructors/context';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultData, ResultRef } from '~/factory/constructors/result';
import { BiotaFunctionName, ReferenceId, BiotaRoleName } from './constructors';
import { DEFAULT_EXPIRATION_DURATION } from '~/consts';

// tslint:disable-next-line: only-arrow-functions
export const session: FactoryContext<FactorySession> = function (context): FactorySession {
  // tslint:disable-next-line: only-arrow-functions
  return (id = null) => {
    return {
      ...document(context, { prefix: 'Session' })(BiotaCollectionName('sessions'), id),
      passport() {
        const inputs = {};
        // ↓↓↓↓
        const query = MethodQuery(
          {
            has_identity: q.HasIdentity(),
            is_session_identity: q.If(
              q.Var('has_identity'),
              q.Equals(q.Select(['collection', 'id'], q.Identity(), null), BiotaCollectionName('sessions')),
              false,
            ),
            session: q.If(q.Var('is_session_identity'), q.Identity(), null),
            user: q.If(q.Var('is_session_identity'), q.Select(['data', '_membership', 'owner'], q.Get(q.Var('session')), null), null),
          },
          {
            session: q.Var('session'),
            user: q.Var('user'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.session.passport';
        const online = {
          name: BiotaFunctionName('SessionPassport'),
          role: q.Role(BiotaRoleName('system')),
          data: { meta: { addToRoles: [BiotaRoleName('user'), BiotaRoleName('public')] } },
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      identity() {
        const inputs = { id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            session: q.Ref(q.Collection(BiotaCollectionName('sessions')), q.Var('id')),
            user: q.Select(['data', '_membership', 'owner'], q.Get(q.Var('session')), null),
          },
          {
            session: q.Var('session'),
            user: q.Var('user'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.session.identity';
        const online = {
          name: BiotaFunctionName('SessionIdentity'),
          role: q.Role(BiotaRoleName('system')),
          // data: { meta: { addToRoles: [BiotaRoleName('system')] } },
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      start(expireIn, user = ContextProp(q.Var('ctx'), 'identity')) {
        const inputs = { expireIn, user };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: q.Let(
              {
                validExpireIn: q.IsNumber(q.Var('expireIn')),
                expire_at: q.If(
                  q.Var('validExpireIn'),
                  q.TimeAdd(q.Now(), q.ToNumber(q.Var('expireIn')), 'milliseconds'),
                  q.TimeAdd(q.Now(), DEFAULT_EXPIRATION_DURATION, 'milliseconds'),
                ),
              },
              q.Let(
                {
                  sessionRef: ResultRef(session(q.Var('ctx'))().insert({})),
                  sessionId: ReferenceId(q.Var('sessionRef')),
                  session_owner: ResultData(session(q.Var('ctx'))(q.Var('sessionId')).membership.owner.set(q.Var('user'))),
                  session_expire: ResultData(session(q.Var('ctx'))(q.Var('sessionId')).expireAt(q.Var('expire_at'))),
                  authed_session: ResultData(token(q.Var('ctx'))().insert({ instance: q.Var('sessionRef') })),
                },
                q.If(
                  q.And(q.IsObject(q.Var('authed_session')), q.Contains('secret', q.Var('authed_session'))),
                  q.Var('authed_session'),
                  ThrowError(q.Var('ctx'), 'Failed to get a secret', { user: q.Var('user'), expire_at: q.Var('expire_at') }),
                ),
              ),
            ),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.session.start';
        const online = { name: BiotaFunctionName('SessionStart'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
