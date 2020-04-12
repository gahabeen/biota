import { Expr } from 'faunadb';
import { FaunaString, FaunaRef, FaunaNumber } from 'types/fauna';
import { FactoryDocumentApi } from './factory.document';

export type FactoryUserSession = (idOrRef?: FaunaString | FaunaRef) => FactoryUserSessionApi;

export interface FactoryUserSessionApi extends FactoryDocumentApi {
  start(user: FaunaRef, expireAt: FaunaNumber): Expr;
}
