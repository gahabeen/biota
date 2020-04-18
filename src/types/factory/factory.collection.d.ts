import { Expr } from 'faunadb';
import { FaunaCollectionOptions, FaunaPaginateOptions, FaunaPaginateMapper, FaunaRef, FaunaString } from '../fauna';

export type FactoryCollection<OT = FactoryCollectionApi> = (name?: FaunaString) => OT;

export type FactoryCollectionApi<OT = Expr> = {
  findAll(pagination: FaunaPaginateOptions): OT;
  get(): OT;
  insert(options: FaunaCollectionOptions): OT;
  update(options: FaunaCollectionOptions): OT;
  upsert(options: FaunaCollectionOptions): OT;
  replace(options: FaunaCollectionOptions): OT;
  repsert(options: FaunaCollectionOptions): OT;
  delete(): OT;
  forget(): OT;
  restore(): OT;
  expireAt(time: Expr): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
  drop(): OT;
}
