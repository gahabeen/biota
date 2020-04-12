import { Expr } from 'faunadb';
import { FaunaCollectionOptions, FaunaRef } from '../fauna';

export type FactoryDatabase = (name: string | Expr) => FactoryDatabaseApi;

export interface FactoryDatabaseApi {
  get(): Expr;
  insert(options: FaunaCollectionOptions): Expr;
  update(options: FaunaCollectionOptions): Expr;
  upsert(options: FaunaCollectionOptions): Expr;
  replace(options: FaunaCollectionOptions): Expr;
  repsert(options: FaunaCollectionOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  clean(): Expr;
}
