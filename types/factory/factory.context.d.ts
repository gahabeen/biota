import { FaunaRef, FaunaString, FaunaBoolean } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryContext<T> = (context?: FactoryContextDefinition, options?: FactoryContextOptions) => T;

export interface FactoryContextOptions {
  prefix?: string;
}

export type FactoryContextDefinition =
  | {
      identity?: FaunaRef;
      session?: FaunaRef;
      useRole?: FaunaRef;
      callstack?: FaunaString;
      offline?: FaunaBoolean;
      hasIdentity?: FaunaBoolean;
      hasSession?: FaunaBoolean;
      logActions?: FaunaBoolean;
      annotateDocuments?: FaunaBoolean;
      skipErrors?: FaunaBoolean;
    }
  | Expr;
