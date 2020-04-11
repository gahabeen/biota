import { Expr } from 'faunadb';
import { FaunaId, FaunaDocumentOptions } from '../fauna';
import { DocumentAuthAccount } from 'types/document';

export interface DBFactorySpecificUserAuthAccountApi {
  upsert(id: string, account: DocumentAuthAccount): Expr;
  repsert(id: string, account: DocumentAuthAccount): Expr;
  delete(id: string, provider: string, accountId: string): Expr;
}

export interface DBFactorySpecificUserAuthApi {
  account: DBFactorySpecificUserAuthAccountApi;
}

export interface DBFactorySpecificUserApi {
  register(email: string, password: string, data?: FaunaDocumentOptions['data']): Expr;
  registerWithAuthAccount(account: DocumentAuthAccount): Expr;
  login(email: string, password: string): Expr;
  loginWithAuthAccount(account: DocumentAuthAccount): Expr;
  logout(everywhere: boolean): Expr;
  changePassword(password: string): Expr;
  auth: DBFactorySpecificUserAuthApi;
}
