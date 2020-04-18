import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactorySession } from '~/types/factory/factory.session';
import { document } from '~/factory/api/document';
import { token } from '~/factory/api/token';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { ContextProp } from '~/factory/constructors/context';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const session: FactoryContext<FactorySession> = function (context): FactorySession {
  // tslint:disable-next-line: only-arrow-functions
  return (id = null) => {
    return {
      ...document(context, { prefix: 'Session' })(BiotaCollectionName('user_sessions'), id),
      start(expireAt, user = ContextProp(q.Var('ctx'), 'identity')) {
        const inputs = { expireAt, user };
        // ----
        const query = Query(
          {
            doc: q.Let(
              {
                validExpireAt: q.Or(q.IsNumber(q.Var('expireAt')), q.IsTimestamp(q.Var('expireAt'))),
                expire_at: q.If(
                  q.Var('validExpireAt'),
                  q.TimeAdd(q.Now(), q.ToNumber(q.Var('expireAt')), 'milliseconds'),
                  q.TimeAdd(q.Now(), 1, 'hours'),
                ),
              },
              q.Let(
                {
                  session: ResultData(session(q.Var('ctx'))().insert({})),
                  sessionRef: q.Select('ref', q.Var('session')),
                  session_owner: ResultData(session(q.Var('ctx'))(q.Var('sessionRef')).membership.owner.set(q.Var('user'))),
                  session_expire: ResultData(session(q.Var('ctx'))(q.Var('sessionRef')).expireAt(q.Var('expire_at'))),
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
        // ----
        const offline = 'factory.session.start';
        const online = { name: BiotaFunctionName('SessionStart'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
