import { Expr } from 'faunadb';
import { DocumentActionName } from 'types/document';
import { FaunaNumber, FaunaRef, FaunaDocument } from '../fauna';

export type FactoryAction = (name: DocumentActionName, refOrDoc: FaunaRef | FaunaDocument) => FactoryActionApi;

export interface FactoryActionApi {
  insert(): Expr;
  annotate(): Expr;
  dispatch(): Expr;
}
