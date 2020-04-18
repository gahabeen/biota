import { Expr } from 'faunadb';
import { FaunaCollectionOptions, FaunaRef } from '../fauna';

export type FactoryDatabase<OT = FactoryDatabaseApi> = (name: string | Expr) => OT;

export interface FactoryDatabaseApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaCollectionOptions): OT;
  update(options: FaunaCollectionOptions): OT;
  upsert(options: FaunaCollectionOptions): OT;
  replace(options: FaunaCollectionOptions): OT;
  repsert(options: FaunaCollectionOptions): OT;
  delete(): OT;
  forget(): OT;
  drop(): OT;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
