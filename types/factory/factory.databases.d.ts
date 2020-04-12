import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactoryDatabasesApi {
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
