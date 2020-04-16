import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryKeysApi } from '~/../types/factory/factory.keys';

import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const keys: FactoryContext<FactoryKeysApi> = function (context): FactoryKeysApi {
  return {
    findAll(pagination) {

      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Keys(), q.Var('pagination')), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.paginate';
      const online = { name: BiotaFunctionName('KeysPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
