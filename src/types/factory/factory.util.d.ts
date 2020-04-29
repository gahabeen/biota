import { Expr } from 'faunadb';

export interface FactoryUtilApi<OT = Expr> {
  // temporary
  [key: string]: any; //(...args: any[]) => OT;
}
