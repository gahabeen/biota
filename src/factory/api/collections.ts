import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryCollectionsApi } from '~/../types/factory/factory.collections';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const collections: FactoryContext<FactoryCollectionsApi> = function (context): FactoryCollectionsApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Collections(), pagination);
    },
  };
};
