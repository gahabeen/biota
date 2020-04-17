import { Expr } from 'faunadb';
import { FaunaString, FaunaRef, FaunaNumber } from 'types/fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactorySession<OT = FactorySessionApi> = (idOrRef?: FaunaString | FaunaRef) => OT;

export interface FactorySessionApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  start(user: FaunaRef, expireAt: FaunaNumber): OT;
}
