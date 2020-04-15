import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDatabasesApi } from '~/../types/factory/factory.databases';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const databases: FactoryContext<FactoryDatabasesApi> = function (context): FactoryDatabasesApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Databases(), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.databases.paginate';
      const online = { name: BiotaFunctionName('DatabasesPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
