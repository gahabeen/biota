import { Expr } from 'faunadb';
import { FaunaCollectionOptions } from '../fauna';

export type FactoryCollection = (name: string | Expr) => FactoryCollectionApi;

export interface FactoryCollectionApi {
  get(): Expr;
  insert(options: FaunaCollectionOptions): Expr;
  update(options: FaunaCollectionOptions): Expr;
  upsert(options: FaunaCollectionOptions): Expr;
  replace(options: FaunaCollectionOptions): Expr;
  repsert(options: FaunaCollectionOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  restore(): Expr;
  expireAt(time: Expr): Expr;
  expireIn(delay: number | Expr): Expr;
  expireNow(): Expr;
  drop(): Expr;
}
