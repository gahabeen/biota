import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryRolesApi } from '~/../types/factory/factory.roles';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const roles: FactoryContext<FactoryRolesApi> = function (context): FactoryRolesApi {
  return {
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Roles(), pagination);
    },
  };
};
