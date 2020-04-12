import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactoryKeysApi {
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
