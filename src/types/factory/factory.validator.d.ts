import { Expr } from 'faunadb';

// export interface FactoryValidatorState {
//   // temporary
//   [key: string]: (...args: any[]) => Expr;
// }
// export type FactoryValidator<OT = FactoryValidatorApi> = (state?: FactoryValidatorState) => OT;

export interface FactoryValidatorApi<OT = Expr> {
  // temporary
  [key: string]: any; //(...args: any[]) => OT;
}
