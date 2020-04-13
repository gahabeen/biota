import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryTokensApi } from '~/../types/factory/factory.tokens';
import { DefaultToOjbect } from './ql/defaultTo';
import { BiotaIndexName } from '../constructors';

// tslint:disable-next-line: only-arrow-functions
export const tokens: FactoryContext<FactoryTokensApi> = function (context): FactoryTokensApi {
  return {
    findByInstance(instance, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(BiotaIndexName('tokens__by__instance')), instance), pagination);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Documents(q.Tokens()), pagination);
    },
  };
};
