import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaString } from 'types/fauna';
import { DocumentAuthAccount } from 'types/document';

export interface FactoryUsersApi {
  getByAuthAccount(providerOrAccount: FaunaString | DocumentAuthAccount, accountId?: FaunaString): Expr;
  getByAuthEmail(email: FaunaString): Expr;
  paginate(pagination: FaunaPaginateOptions | Expr): Expr;
}
