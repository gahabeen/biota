import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef, FaunaString } from 'types/fauna';

export interface FactoryIndexesApi {
  findByResource(resource: FaunaRef, pagination: FaunaPaginateOptions | Expr): Expr;
  findByTerm(term: FaunaString, pagination: FaunaPaginateOptions | Expr): Expr;
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
