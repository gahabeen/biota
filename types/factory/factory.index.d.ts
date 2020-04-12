import { Expr } from 'faunadb';
import { FaunaIndexOptions } from '../fauna';

export type FactoryIndex = (name: string | Expr) => FactoryIndexApi;

export interface FactoryIndexApi {
  get(): Expr;
  insert(options: FaunaIndexOptions): Expr;
  update(options: FaunaIndexOptions): Expr;
  upsert(options: FaunaIndexOptions): Expr;
  replace(options: FaunaIndexOptions): Expr;
  repsert(options: FaunaIndexOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  clean(): Expr;
}
