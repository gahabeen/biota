import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactoryRolesApi {
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
