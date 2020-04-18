import { Expr } from 'faunadb';
import { FaunaIndexOptions } from '../fauna';

export type FactoryIndex<OT = FactoryIndexApi> = (name: string | Expr) => OT;

export interface FactoryIndexApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaIndexOptions): OT;
  update(options: FaunaIndexOptions): OT;
  upsert(options: FaunaIndexOptions): OT;
  replace(options: FaunaIndexOptions): OT;
  repsert(options: FaunaIndexOptions): OT;
  delete(): OT;
  forget(): OT;
  drop(): OT;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
