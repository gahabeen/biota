import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaString } from '../fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactoryAction<OT = FactoryActionApi> = (id?: FaunaId) => OT;

export interface FactoryActionApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  log(name: FaunaString, ref: FaunaRef): OT;
}
