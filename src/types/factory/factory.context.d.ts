import { FaunaRef, FaunaString, FaunaBoolean } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryContext<OT> = (context?: FactoryContextDefinition, options?: FactoryContextOptions) => OT;

export interface FactoryContextOptions {
  prefix?: string;
}
export interface FactoryContextInterface {
  test?: boolean;
  identity?: FaunaRef;
  hasIdentity?: FaunaBoolean;
  alternativeIdentity?: FaunaRef;
  hasAlternativeIdentity?: FaunaBoolean;
  session?: FaunaRef;
  hasSession?: FaunaBoolean;
  checkRole?: FaunaRef;
  callstack?: FaunaString;
  offline?: FaunaBoolean;
  logActions?: FaunaBoolean;
  annotateDocuments?: FaunaBoolean;
  skipErrors?: FaunaBoolean;
}
export type FactoryContextDefinition = FactoryContextInterface | Expr;
