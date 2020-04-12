import { Expr } from 'faunadb';
import { DocumentActionName } from 'types/document';
import { FaunaNumber, FaunaRef } from '../fauna';

export type FactoryAction = (name: DocumentActionName, ref: FaunaRef, ts: FaunaNumber) => FactoryActionApi;

export interface FactoryActionApi {
  insert(): Expr;
  annotate(): Expr;
  dispatch(): Expr;
}
