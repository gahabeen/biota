import { PromiseFn, Fn, Fauna } from "../db";
import { FaunaRef } from "../fauna";

export interface BiotaFactoryFqlWrapper {
  fql?: object;
  query?: PromiseFn<any>;
  then?: PromiseFn<any>;
}

export interface BiotaFactoryFqlWrapperOptions {
  then: PromiseFn<any>;
}

export interface BiotaFactoryQL {
  Batch: Fn<any>;
  Ref: Fn<FaunaRef>;
}

export interface BiotaFactoryScaffoldOptions {
  collections?: any[];
  indexes?: any[];
  roles?: any[];
  functions?: any[];
  documents?: any[];
}

export interface BiotaFactoryScaffold {
  collection?: Fn<Fauna.Expr>;
  collections?: BiotaFactoryScaffoldCollections;
  indexes?: BiotaFactoryScaffoldIndexes;
  functions?: BiotaFactoryScaffoldFunctions;
  roles?: BiotaFactoryScaffoldRoles;
}

export interface BiotaFactoryScaffoldCollections {
  defaults?: Fn<Fauna.Expr>;
  users?: Fn<Fauna.Expr>;
  activities?: Fn<Fauna.Expr>;
}

export interface BiotaFactoryScaffoldIndexes {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}

export interface BiotaFactoryScaffoldFunctions {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}

export interface BiotaFactoryScaffoldRoles {
  defaults?: Fn<Fauna.Expr>;
  for?: Fn<Fauna.Expr>;
}
