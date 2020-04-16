import { Expr } from 'faunadb';
import { FaunaTime, FaunaRef } from 'types/fauna';

export interface FactoryHistoryApi<OT = Expr> {
  at(timestamp: FaunaTime, expression: Expr): OT;
  events(ref: FaunaRef): OT;
}
