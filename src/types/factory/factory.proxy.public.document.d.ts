import { Expr } from 'faunadb';
import { FaunaString } from '../fauna';

export type FactoryProxyPublicDocument<OT = FactoryProxyPublicDocumentApi> = (collection?: FaunaString, id?: FaunaString) => OT;

export interface FactoryProxyPublicDocumentApi<OT = Expr> {
  get(): OT;
}
