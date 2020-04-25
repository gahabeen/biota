import { Expr } from 'faunadb';
import { FaunaId, FaunaRef, FaunaString } from '~/types/fauna';

export type FactoryCredential<OT = FactoryCredentialApi> = (idOrInstance?: FaunaId | FaunaRef) => OT;

export interface FactoryCredentialApi<OT = Expr> {
  get(): OT;
  insert(password?: FaunaString): OT;
  update(currentPassword: FaunaString, password: FaunaString): OT;
  repsert(password: FaunaString): OT;
  replace(password: FaunaString): OT;
  // delete(): OT;
  forget(): OT;
  drop(): OT;
}
