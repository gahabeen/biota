import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef, FaunaPaginateMapper } from 'types/fauna';

export interface FactoryTokensApi<OT = Expr> {
  findByInstance(instance: FaunaRef, pagination: FaunaPaginateOptions | Expr): OT;
 findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
