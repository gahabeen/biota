import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryAt } from '~/../types/factory/factory.at';
import { DefaultToOjbect } from './ql/defaultTo';
import { FaunaTime } from 'types/fauna';

// tslint:disable-next-line: only-arrow-functions
export const at: FactoryContext<FactoryAt> = function (contextExpr): FactoryAt {
  return (time: FaunaTime) => {
    return '';
  };
};
