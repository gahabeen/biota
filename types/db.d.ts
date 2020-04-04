import * as Fauna from "faunadb";
import { DocumentActivity } from "./document";
import { FaunaCollection, FaunaDocumentOptions, FaunaId, FaunaRef } from "./fauna";
export { Fauna };

export type Fn<T = object> = (...args: any[]) => T;
export type ValueOptionsFn<T = object> = (value: String | T, options?: T) => Fauna.Expr;
export type PromiseFn<T = object> = (...args: any[]) => Promise<T>;

export interface DBFoundationOptions {
  roles?: boolean;
  functions?: boolean;
  collections?: boolean;
  indexes?: boolean;
}

export interface DBFactoryFqlWrapper {
  fql?: object;
  query?: PromiseFn<any>;
  then?: PromiseFn<any>;
}

export interface DBFactoryFqlWrapperOptions {
  then: PromiseFn<any>;
}

export interface DBFactoryQL {
  Batch: Fn<any>;
  Ref: Fn<FaunaRef>;
}

export interface DBFactoryScaffoldOptions {
  collections?: any[];
  indexes?: any[];
  roles?: any[];
  functions?: any[];
  documents?: any[];
}

export interface DBFactoryScaffold {
  collection?: Fn<Fauna.Expr>;
  collections?: DBFactoryScaffoldCollections;
  indexes?: DBFactoryScaffoldIndexes;
  functions?: DBFactoryScaffoldFunctions;
  roles?: DBFactoryScaffoldRoles;
}

export interface DBFactoryScaffoldCollections {
  defaults?: Fn<Fauna.Expr>;
  users?: Fn<Fauna.Expr>;
  activities?: Fn<Fauna.Expr>;
}

export interface DBFactoryScaffoldIndexes {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}

export interface DBFactoryScaffoldFunctions {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}

export interface DBFactoryScaffoldRoles {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}

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

export type ActionName = "insert" | "update" | "replace" | "delete" | "forget" | "credentials" | "assign" | "own" | "expire" | "archive";

export interface Action {
  document: FaunaRef;
  ts: number;
  user: FaunaRef;
  name: ActionName;
}
