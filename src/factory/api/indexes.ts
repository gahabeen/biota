import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryIndexesApi } from 'types/factory/factory.indexes';
import { DefaultToOjbect } from './ql/defaultTo';
import { indexNameNormalized } from '../classes';

// tslint:disable-next-line: only-arrow-functions
export const indexes: FactoryContext<FactoryIndexesApi> = function (contextExpr): FactoryIndexesApi {
  return {
    findByResource(resource, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(indexNameNormalized('indexes__by__resource')), resource), pagination);
    },
    findByTerm(term, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(indexNameNormalized('indexes__by__terms')), term), pagination);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Indexes(), pagination);
    },
  };
};
