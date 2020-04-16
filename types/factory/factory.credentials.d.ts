import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef, FaunaPaginateMapper } from 'types/fauna';

export interface FactoryCredentialsApi<OT = Expr> {
  findByInstance(instance: FaunaRef, pagination: FaunaPaginateOptions | Expr): OT;
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
