import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDatabasesApi } from '~/../types/factory/factory.databases';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const databases: FactoryContext<FactoryDatabasesApi> = function (context): FactoryDatabasesApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Databases(), pagination);
    },
  };
};
