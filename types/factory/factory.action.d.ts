import { Expr } from 'faunadb';
import { DocumentActionName } from 'types/document';
import { FaunaNumber, FaunaRef, FaunaDocument } from '../fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactoryAction = (name: DocumentActionName, refOrDoc: FaunaRef | FaunaDocument) => FactoryActionApi;

export interface FactoryActionApi extends FactoryDocumentApi {
  log(): Expr;
}
