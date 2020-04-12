import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactoryUDFunctionsApi {
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
