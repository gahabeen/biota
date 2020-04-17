import { Expr } from 'faunadb';
import { FactoryDocumentsApi } from './factory.documents';
import { FaunaPaginateOptions } from 'types/fauna';

export interface FactorySessionsApi<OT = Expr> extends FactoryDocumentsApi<OT> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
}
