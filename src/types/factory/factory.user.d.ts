import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaDocumentOptions, FaunaString, FaunaTime } from '../fauna';
import { DocumentAuthAccount } from '../document';
import { FactoryDocumentApi } from './factory.document';

export interface FactoryDocumentAuthAccountsApi<OT = Expr> {
  distinct(account: DocumentAuthAccount): OT;
  difference(provider: FaunaString, accountId: FaunaString): OT;
  set(account: DocumentAuthAccount): OT;
  remove(provider: FaunaString, accountId: FaunaString): OT;
}

export interface FactoryDocumentAuthEmailApi<OT = Expr> {
  set(email: FaunaString): OT;
  remove(): OT;
}

export interface FactoryDocumentAuthApi<OT = Expr> {
  email: FactoryDocumentAuthEmailApi<OT>;
  account: FactoryDocumentAuthAccountsApi<OT>;
}

export type FactoryUser<OT = FactoryUserApi> = (id?: FaunaId) => OT;

export interface FactoryUserApi<OT = Expr> extends FactoryDocumentApi<Expr> {
  register(email: FaunaString, password: FaunaString, data?: FaunaDocumentOptions['data'], expireIn?: FaunaTime): OT;
  registerWithAuthAccount(account: DocumentAuthAccount, expireIn?: FaunaTime): OT;
  login(email: FaunaString, password: FaunaString, expireIn?: FaunaTime): OT;
  loginWithAuthAccount(account: DocumentAuthAccount, expireIn?: FaunaTime): OT;
  logout(everywhere: boolean): OT;
  changePassword(currentPassword: FaunaString, password: FaunaString): OT;
  auth: FactoryDocumentAuthApi<OT>;
}
