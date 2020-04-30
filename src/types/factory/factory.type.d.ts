import { Expr } from 'faunadb';

// export interface FactoryTypeState {
//   // temporary
//   [key: string]: (...args: any[]) => Expr;
// }
// export type FactoryType<OT = FactoryTypeApi> = (state?: FactoryTypeState) => OT;

export interface FactoryTypeApi<OT = Expr> {
  // temporary
  [key: string]: any; //(...args: any[]) => OT;
}
