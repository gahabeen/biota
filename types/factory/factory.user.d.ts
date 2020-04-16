import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaDocumentOptions } from '../fauna';
import { DocumentAuthAccount } from '../document';
import { FactoryDocumentApi } from './factory.document';

export interface FactoryDocumentAuthAccountsApi<OT = Expr> {
  distinct(account: DocumentAuthAccount): OT;
  difference(provider: string, accountId: string): OT;
  set(account: DocumentAuthAccount): OT;
  remove(provider: string, accountId: string): OT;
}

export interface FactoryDocumentAuthEmailApi<OT = Expr> {
  set(email: string): OT;
  remove(): OT;
}

export interface FactoryDocumentAuthApi<OT = Expr> {
  email: FactoryDocumentAuthEmailApi<OT>;
  accounts: FactoryDocumentAuthAccountsApi<OT>;
}

export type FactoryUser<OT = FactoryUserApi> = (idOrRef?: FaunaId | FaunaRef) => OT;

export interface FactoryUserApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  register(email: string, password: string, data?: FaunaDocumentOptions['data']): OT;
  registerWithAuthAccount(account: DocumentAuthAccount): OT;
  login(email: string, password: string): OT;
  loginWithAuthAccount(account: DocumentAuthAccount): OT;
  logout(everywhere: boolean): OT;
  changePassword(currentPassword: string, password: string): OT;
  auth: FactoryDocumentAuthApi;
}
