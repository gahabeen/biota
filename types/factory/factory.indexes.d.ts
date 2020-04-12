import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef, FaunaString, FaunaStringArray } from 'types/fauna';

export interface FactoryIndexesApi {
  findIndex(resource: FaunaRef, termFields: FaunaStringArray): Expr;
  searchQuery(resource: FaunaRef, searchTerms: object): Expr;
  findByResource(resource: FaunaRef, pagination: FaunaPaginateOptions | Expr): Expr;
  findByTerm(term: FaunaString, pagination: FaunaPaginateOptions | Expr): Expr;
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
