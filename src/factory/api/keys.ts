import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryKeysApi } from '~/../types/factory/factory.keys';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const keys: FactoryContext<FactoryKeysApi> = function (contextExpr): FactoryKeysApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Keys(), pagination);
    },
  };
};
