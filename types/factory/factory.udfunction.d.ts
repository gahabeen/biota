import { Expr } from 'faunadb';
import { FaunaUDFunctionOptions } from '../fauna';

export type FactoryUDFunction = (name: string | Expr) => FactoryUDFunctionApi;

export interface FactoryUDFunctionApi {
  get(): Expr;
  insert(options: FaunaUDFunctionOptions): Expr;
  update(options: FaunaUDFunctionOptions): Expr;
  upsert(options: FaunaUDFunctionOptions): Expr;
  replace(options: FaunaUDFunctionOptions): Expr;
  repsert(options: FaunaUDFunctionOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  clean(): Expr;
}
