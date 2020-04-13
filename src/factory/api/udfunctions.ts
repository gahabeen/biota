import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUDFunctionsApi } from '~/../types/factory/factory.udfunctions';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const udfunctions: FactoryContext<FactoryUDFunctionsApi> = function (context): FactoryUDFunctionsApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Functions(), pagination);
    },
  };
};
