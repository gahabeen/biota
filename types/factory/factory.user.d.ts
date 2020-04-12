import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaDocumentOptions } from '../fauna';
import { DocumentAuthAccount } from '../document';
import { FactoryDocumentApi } from './factory.document';

export interface FactoryDocumentAuthAccountsApi {
  distinct(account: DocumentAuthAccount): Expr;
  difference(provider: string, accountId: string): Expr;
  set(account: DocumentAuthAccount): Expr;
  remove(provider: string, accountId: string): Expr;
}

export interface FactoryDocumentAuthEmailApi {
  set(email: string): Expr;
  remove(): Expr;
}

export interface FactoryDocumentAuthApi {
  email: FactoryDocumentAuthEmailApi;
  accounts: FactoryDocumentAuthAccountsApi;
}

export type FactoryUser = (idOrRef?: FaunaId | FaunaRef) => FactoryUserApi;

export interface FactoryUserApi extends FactoryDocumentApi {
  register(email: string, password: string, data?: FaunaDocumentOptions['data']): Expr;
  registerWithAuthAccount(account: DocumentAuthAccount): Expr;
  login(email: string, password: string): Expr;
  loginWithAuthAccount(account: DocumentAuthAccount): Expr;
  logout(everywhere: boolean): Expr;
  changePassword(currentPassword: string, password: string): Expr;
  auth: FactoryDocumentAuthApi;
}
