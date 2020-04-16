import { Expr } from 'faunadb';
import { FaunaString, FaunaRef, FaunaNumber } from 'types/fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactoryUserSession<OT = FactoryUserSessionApi> = (idOrRef?: FaunaString | FaunaRef) => OT;

export interface FactoryUserSessionApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  start(user: FaunaRef, expireAt: FaunaNumber): OT;
}
