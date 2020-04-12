import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryCredentialsApi } from '~/../types/factory/factory.credentials';
import { DefaultToOjbect } from './ql/defaultTo';
import { indexNameNormalized } from '../classes';

// tslint:disable-next-line: only-arrow-functions
export const credentials: FactoryContext<FactoryCredentialsApi> = function (contextExpr): FactoryCredentialsApi {
  return {
    findByInstance(instance, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(indexNameNormalized('credentials__by__instance')), instance), pagination);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Documents(q.Credentials()), pagination);
    },
  };
};
