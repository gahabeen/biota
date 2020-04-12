import { FaunaRef } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryContext<T> = (context?: FactoryContextOptions) => T;

export type FactoryContextOptions =
  | {
      identity: string | Expr;
      session: string | Expr;
      parentUDFunction: string | FaunaRef | Expr;
      usersIndex: FaunaRef;
      userSessionsIndex: FaunaRef;
    }
  | Expr;
