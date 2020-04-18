import { Expr } from 'faunadb';
import { FaunaRef } from '../fauna';

export interface FactoryQLApi<OT = Expr> {
  context: OT;
  identity(allowSession: boolean): OT;
  reference(collectionOrRef: string | FaunaRef, id?: string | Expr): OT;
}
