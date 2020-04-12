import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef } from 'types/fauna';

export interface FactoryCredentialsApi {
  findByInstance(instance: FaunaRef, pagination: FaunaPaginateOptions | Expr): Expr;
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
