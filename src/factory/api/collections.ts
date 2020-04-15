import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryCollectionsApi } from '~/../types/factory/factory.collections';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const collections: FactoryContext<FactoryCollectionsApi> = function (context): FactoryCollectionsApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Collections(), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.paginate';
      const online = { name: BiotaFunctionName('CollectionsPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
