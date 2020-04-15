import { Expr } from 'faunadb';
import { FaunaKeyOptions, FaunaId, FaunaRef } from '../fauna';

export type FactoryKey = (idOrRef: FaunaId | FaunaRef) => FactoryKeyApi;

export interface FactoryKeyApi {
  get(): Expr;
  insert(options: FaunaKeyOptions): Expr;
  update(options: FaunaKeyOptions): Expr;
  upsert(options: FaunaKeyOptions): Expr;
  replace(options: FaunaKeyOptions): Expr;
  repsert(options: FaunaKeyOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  drop(): Expr;
}
