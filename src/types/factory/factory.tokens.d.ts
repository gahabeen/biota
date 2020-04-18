import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaRef, FaunaPaginateMapper } from '~/types/fauna';
import { FactoryDocumentsApi } from './factory.documents';

export interface FactoryTokensApi<OT = Expr> extends FactoryDocumentsApi<OT> {
  findByInstance(instance: FaunaRef, pagination: FaunaPaginateOptions | Expr): OT;
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
