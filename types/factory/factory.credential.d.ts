import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaString } from 'types/fauna';

export type FactoryCredential = (idOrRefOrInstance?: FaunaId | FaunaRef) => FactoryCredentialApi;

export interface FactoryCredentialApi {
  get(): Expr;
  insert(password?: FaunaString): Expr;
  update(currentPassword: FaunaString, password: FaunaString): Expr;
  repsert(password: FaunaString): Expr;
  replace(password: FaunaString): Expr;
  // delete(): Expr;
  forget(): Expr;
  clean(): Expr;
}
