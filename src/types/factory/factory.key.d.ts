import { Expr } from 'faunadb';
import { FaunaId, FaunaKeyOptions } from '../fauna';

export type FactoryKey<OT = FactoryKeyApi> = (id: FaunaId) => OT;

export interface FactoryKeyApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaKeyOptions): OT;
  update(options: FaunaKeyOptions): OT;
  upsert(options: FaunaKeyOptions): OT;
  replace(options: FaunaKeyOptions): OT;
  repsert(options: FaunaKeyOptions): OT;
  // delete(): OT;
  revoke(): OT;
  forget(): OT;
  drop(): OT;
  // restore(): OT;
  // expireAt(time: OT): OT;
  // expireIn(delay: number | Expr): OT;
  // expireNow(): OT;
}
