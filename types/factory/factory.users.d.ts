import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaString, FaunaPaginateMapper } from 'types/fauna';
import { DocumentAuthAccount } from 'types/document';

export interface FactoryUsersApi<OT = Expr> {
  getByAuthAccount(providerOrAccount: FaunaString | DocumentAuthAccount, accountId?: FaunaString): OT;
  getByAuthEmail(email: FaunaString): OT;
 findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
