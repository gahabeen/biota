import { Expr } from 'faunadb';
import { FaunaTokenOptions, FaunaId, FaunaRef } from '../fauna';

export type FactoryToken = (idOrRefOrInstance?: FaunaId | FaunaRef) => FactoryTokenApi;

export interface FactoryTokenApi {
  get(): Expr;
  insert(options: FaunaTokenOptions): Expr;
  update(options: FaunaTokenOptions): Expr;
  upsert(options: FaunaTokenOptions): Expr;
  replace(options: FaunaTokenOptions): Expr;
  repsert(options: FaunaTokenOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  clean(): Expr;
}
