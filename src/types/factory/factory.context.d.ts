import { FaunaRef, FaunaString, FaunaBoolean } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryContext<OT> = (context?: FactoryContextDefinition, options?: FactoryContextOptions) => OT;

export interface FactoryContextOptions {
  prefix?: string;
}

export type FactoryContextDefinition =
  | {
      identity?: FaunaRef;
      session?: FaunaRef;
      checkRole?: FaunaRef;
      callstack?: FaunaString;
      offline?: FaunaBoolean;
      hasIdentity?: FaunaBoolean;
      hasSession?: FaunaBoolean;
      logActions?: FaunaBoolean;
      annotateDocuments?: FaunaBoolean;
      skipErrors?: FaunaBoolean;
    }
  | Expr;
