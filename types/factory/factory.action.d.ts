import { Expr } from 'faunadb';
import { DocumentActionName } from 'types/document';
import { FaunaDocument, FaunaRef } from '../fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactoryAction<OT = FactoryActionApi> = (name: DocumentActionName, refOrDoc: FaunaRef | FaunaDocument) => OT;

export interface FactoryActionApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  log(): OT;
}
