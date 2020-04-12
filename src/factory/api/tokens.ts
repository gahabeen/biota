import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryTokensApi } from '~/../types/factory/factory.tokens';
import { DefaultToOjbect } from './ql/defaultTo';
import { indexNameNormalized } from '../classes';

// tslint:disable-next-line: only-arrow-functions
export const tokens: FactoryContext<FactoryTokensApi> = function (contextExpr): FactoryTokensApi {
  return {
    findByInstance(instance, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(indexNameNormalized('tokens__by__instance')), instance), pagination);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Documents(q.Tokens()), pagination);
    },
  };
};
