import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUserSession } from '~/../types/factory/factory.userSession';
import { document } from '~/factory/api/document';
import { token } from '~/factory/api/token';
import { BiotaCollectionName } from '../constructors/collection';
import { ThrowError } from '../constructors/error';
import { ContextExtend } from '../constructors/context';

// tslint:disable-next-line: only-arrow-functions
export const userSession: FactoryContext<FactoryUserSession> = function (contextExpr): FactoryUserSession {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRef) => {
    const userSessionApi = userSession(contextExpr);
    const ref = q.If(
      q.IsDoc(idOrRef),
      idOrRef,
      q.If(q.IsString(idOrRef), q.Ref(q.Collection(BiotaCollectionName('user_sessions')), idOrRef), null),
    );

    return {
      ...document(contextExpr)(ref),
      start(user, expireAt) {
        const ctx = ContextExtend(contextExpr, 'factory.userSession.start');
        return q.Let(
          {
            validExpireAt: q.Or(q.IsNumber(expireAt), q.IsTimestamp(expireAt)),
            expire_at: q.If(
              q.Var('validExpireAt'),
              q.TimeAdd(q.Now(), q.ToNumber(expireAt), 'milliseconds'),
              q.TimeAdd(q.Now(), 1, 'hours'),
            ),
          },
          q.Let(
            {
              session: userSessionApi().insert({}),
              session_owner: userSessionApi(q.Var('session')).membership.owner.set(q.Var('session')),
              session_expire: userSessionApi(q.Var('session')).expireAt(q.Var('expire_at')),
              authed_session: token(contextExpr)().insert({ instance: q.Var('session') }),
            },
            q.If(
              q.And(q.IsObject(q.Var('authed_session')), q.Contains('secret', q.Var('authed_session'))),
              q.Var('authed_session'),
              ThrowError(ctx, 'Failed to get a secret', { user, expire_at: q.Var('expire_at') }),
            ),
          ),
        );
      },
    };
  };
};
