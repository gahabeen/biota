import { Expr } from 'faunadb';
import { FaunaUDFunctionOptions } from '../fauna';

export type FactoryUDFunction<OT = FactoryUDFunctionApi> = (name: string | Expr) => OT;

export interface FactoryUDFunctionApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaUDFunctionOptions): OT;
  update(options: FaunaUDFunctionOptions): OT;
  upsert(options: FaunaUDFunctionOptions): OT;
  replace(options: FaunaUDFunctionOptions): OT;
  repsert(options: FaunaUDFunctionOptions): OT;
  delete(): OT;
  forget(): OT;
  drop(): OT;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
