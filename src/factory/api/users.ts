import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUsersApi } from '~/../types/factory/factory.users';
import { DefaultToOjbect } from './ql/defaultTo';
import { BiotaIndexName } from '../constructors';
import { ThrowError } from '../constructors/error';
import { ContextExtend, ContextProp } from '../constructors/context';
import { BiotaFunctionName } from '../constructors/udfunction';
import { BiotaCollectionName } from '../constructors/collection';

// tslint:disable-next-line: only-arrow-functions
export const users: FactoryContext<FactoryUsersApi> = function (contextExpr): FactoryUsersApi {
  const offline = ContextProp(contextExpr, 'offline');

  return {
    getByAuthAccount(providerOrAccount, id) {
      const ctx = ContextExtend(contextExpr, 'factory.users.getByAuthAccount');
      const account = q.If(q.IsObject(providerOrAccount), providerOrAccount, { provider: providerOrAccount, id });
      const provider = q.Select('provider', account, null);
      const accountId = q.Select('id', account, null);

      return q.If(
        offline,
        q.Let(
          {
            user: q.Select(0, q.Match(q.Index(BiotaIndexName('users__by__auth_account')), [provider, accountId]), null),
            userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(ctx, "Could'nt find the user", { account })),
          },
          q.Var('user'),
        ),
        q.Call(BiotaFunctionName('UsersGetByAuthAccount'), ContextExtend(contextExpr, 'udf.UsersGetByAuthAccount'), {
          providerOrAccount,
          id,
        }),
      );
    },
    getByAuthEmail(email) {
      const ctx = ContextExtend(contextExpr, 'factory.users.getByAuthEmail');
      return q.If(
        offline,
        q.Let(
          {
            user: q.Select(0, q.Match(q.Index(BiotaIndexName('users__by__auth_email')), email), null),
            userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(ctx, "Could'nt find the user", { email })),
          },
          q.Var('user'),
        ),
        q.Call(BiotaFunctionName('UsersGetByAuthEmail'), ContextExtend(contextExpr, 'udf.UsersGetByAuthEmail'), {
          email,
        }),
      );
    },
    paginate(pagination) {
      const ctx = ContextExtend(contextExpr, 'factory.users.paginate');
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Documents(q.Collection(BiotaCollectionName('users'))), pagination);
    },
  };
};
