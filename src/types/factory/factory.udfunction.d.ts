import { Expr } from 'faunadb';
import { FaunaUDFunctionOptions, FaunaString } from '../fauna';

export type FactoryUDFunction<OT = FactoryUDFunctionApi> = (name: FaunaString) => OT;

export interface FactoryUDFunctionApi<OT = Expr> {
  exists(): OT;
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
