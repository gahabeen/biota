import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUDFunctionsApi } from '~/../types/factory/factory.udfunctions';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const udfunctions: FactoryContext<FactoryUDFunctionsApi> = function (context): FactoryUDFunctionsApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Functions(), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.functions.paginate';
      const online = { name: BiotaFunctionName('FunctionsPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
