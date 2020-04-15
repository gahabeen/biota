import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryRolesApi } from '~/../types/factory/factory.roles';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const roles: FactoryContext<FactoryRolesApi> = function (context): FactoryRolesApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Roles(), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.paginate';
      const online = { name: BiotaFunctionName('RolesPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
