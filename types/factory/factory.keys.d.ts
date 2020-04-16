import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaPaginateMapper } from 'types/fauna';

export interface FactoryKeysApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
