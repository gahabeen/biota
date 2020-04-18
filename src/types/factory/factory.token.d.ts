import { Expr } from 'faunadb';
import { FaunaTokenOptions, FaunaId, FaunaRef } from '../fauna';

export type FactoryToken<OT = FactoryTokenApi> = (idOrRefOrInstance?: FaunaId | FaunaRef) => OT;

export interface FactoryTokenApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaTokenOptions): OT;
  update(options: FaunaTokenOptions): OT;
  upsert(options: FaunaTokenOptions): OT;
  replace(options: FaunaTokenOptions): OT;
  repsert(options: FaunaTokenOptions): OT;
  delete(): OT;
  forget(): OT;
  drop(): OT;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
