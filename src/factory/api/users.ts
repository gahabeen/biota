import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUsersApi } from '~/../types/factory/factory.users';
import { DefaultToOjbect } from './ql/defaultTo';
import { BiotaIndexName } from '../constructors';
import { ThrowError } from '../constructors/error';
import { ContextExtend, ContextProp } from '../constructors/context';
import { BiotaFunctionName } from '../constructors/udfunction';
import { BiotaCollectionName } from '../constructors/collection';
import { MethodDispatch, Query } from '../constructors/method';

// tslint:disable-next-line: only-arrow-functions
export const users: FactoryContext<FactoryUsersApi> = function (context): FactoryUsersApi {
  return {
    getByAuthAccount(providerOrAccount, id) {
      const account = q.If(q.IsObject(providerOrAccount), providerOrAccount, { provider: providerOrAccount, id });
      const provider = q.Select('provider', account, null);
      const accountId = q.Select('id', account, null);

      const inputs = { account, provider, accountId };
      // ---
      const query = Query(
        {
          user: q.Select(0, q.Match(q.Index(BiotaIndexName('users__by__auth_account')), [q.Var('provider'), q.Var('accountId')]), null),
          userIsValid: q.If(
            q.IsDoc(q.Var('user')),
            true,
            ThrowError(q.Var('ctx'), "Could'nt find the user", { account: q.Var('account') }),
          ),
        },
        q.Var('user'),
      );
      // ---
      const offline = 'factory.users.getByAuthAccount';
      const online = { name: BiotaFunctionName('UsersGetByAuthAccount'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getByAuthEmail(email) {
      const inputs = { email };
      // ---
      const query = Query(
        {
          user: q.Select(0, q.Match(q.Index(BiotaIndexName('users__by__auth_email')), q.Var('email')), null),
          userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(q.Var('ctx'), "Could'nt find the user", { email: q.Var('email') })),
        },
        q.Var('user'),
      );
      // ---
      const offline = 'factory.users.getByAuthEmail';
      const online = { name: BiotaFunctionName('UsersGetByAuthEmail'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Documents(q.Collection(BiotaCollectionName('users'))), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.paginate';
      const online = { name: BiotaFunctionName('UsersPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
