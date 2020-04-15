import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryTokensApi } from '~/../types/factory/factory.tokens';
import { DefaultToOjbect } from './ql/defaultTo';
import { BiotaIndexName } from '../constructors';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const tokens: FactoryContext<FactoryTokensApi> = function (context): FactoryTokensApi {
  return {
    findByInstance(instance, pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { instance, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('tokens__by__instance')), q.Var('instance')), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.paginate';
      const online = { name: BiotaFunctionName('TokensPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Documents(q.Tokens()), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.paginate';
      const online = { name: BiotaFunctionName('TokensPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
