import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactoryCollectionsApi {
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
