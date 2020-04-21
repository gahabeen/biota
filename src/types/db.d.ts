import * as Fauna from 'faunadb';
import { DocumentActivity } from './document';
import { FaunaCollection, FaunaDocumentOptions, FaunaId, FaunaRef } from './fauna';
export { Fauna };

export type Fn<T = object> = (...args: any[]) => T;
export type ValueOptionsFn<T = object> = (value: String | T, options?: T) => Fauna.Expr;
export type PromiseFn<T = object> = (...args: any[]) => Promise<T>;
export type FreeObject = {
  [key: string]: any;
};

export interface CRUDReferenceDocument {
  create?<T = Fauna.Expr>(collection: string, options?: FaunaDocumentOptions, id?: FaunaId): T;
  read?<T = Fauna.Expr>(collection: string, id: FaunaId): T;
  update?<T = Fauna.Expr>(collection: string, id: FaunaId, options: FaunaDocumentOptions): T;
  delete?<T = Fauna.Expr>(collection: string, id: FaunaId): T;
}

export interface ReferenceBuilder {
  collection?: FaunaCollection;
  id?: FaunaId;
  ref?: FaunaRef;
}

export type DocumentBase = {
  [key: string]: any;
  activity?: DocumentActivity;
};

export interface UserRights {
  roles?: FaunaRef[];
}

export type ActionName =
  | 'register'
  | 'register_failed'
  | 'login'
  | 'login_failed'
  | 'insert'
  | 'update'
  | 'replace'
  | 'delete'
  | 'forget'
  | 'credentials'
  | 'assign'
  | 'own'
  | 'expire'
  | 'archive';

export interface Action {
  document: FaunaRef;
  ts: number;
  user: FaunaRef;
  name: ActionName;
}
