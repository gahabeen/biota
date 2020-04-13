import { Expr } from 'faunadb';
import { FaunaRef } from '../fauna';

export interface FactoryQLApi {
  context: Expr;
  defaultTo(value: Expr): Expr;
  identity(allowSession: boolean): Expr;
  reference(collectionOrRef: string | FaunaRef, id?: string | Expr): FaunaRef;
}
