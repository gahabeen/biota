import { PromiseFn, Fn, Fauna } from "../db";
import { FaunaRef } from "../fauna";

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
