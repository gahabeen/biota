import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaString, FaunaPaginateMapper } from '~/types/fauna';
import { DocumentAuthAccount } from '~/types/document';
import { FactoryDocumentsApi } from './factory.documents';

export interface FactoryUsersApi<OT = Expr> extends FactoryDocumentsApi<OT> {
  getByAuthAccount(providerOrAccount: FaunaString | DocumentAuthAccount, accountId?: FaunaString): OT;
  getByAuthEmail(email: FaunaString): OT;
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
