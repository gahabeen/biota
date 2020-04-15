import {
  FaunaPaginateOptions,
  FaunaCollectionOptions,
  FaunaRef,
  FaunaPaginateMapper,
  Fauna,
  FaunaIndexValue,
  FaunaId,
  FaunaIndexTerm,
} from "../fauna";

export interface BiotaFrameworkCollectionApi {
  // builder
  scaffold: (collectionDefinition: FaunaCollectionOptions, options?: BiotaFrameworkCollectionScaffoldOptions) => Promise<any>;
  field: (field: string | BiotaFrameworkCollectionFieldOptions) => Promise<any>;
  index: (field: string | BiotaFrameworkCollectionFieldOptions, options?: BiotaFrameworkIndexOptions) => Promise<any>;
  compute: (field: BiotaFrameworkCollectionFieldOptions, options?: BiotaFrameworkIndexOptions) => Promise<any>;

  // custom crud
  find: (searchQuery?: BiotaFrameworkCollectionSearchParams, pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper) => Promise<any>;
  findAll(pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper): Promise<any>;
  paginate: (
    searchTerms?: BiotaFrameworkCollectionSearchParams,
    pagination?: FaunaPaginateOptions,
    mapper?: FaunaPaginateMapper
  ) => AsyncGenerator<any, any, any>;
  paginateAll(pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper): Promise<any>;

  // basic crud
  get: (id: FaunaId) => Promise<any>;
  // #bug recreate the options type!
  insert: (data: object) => Promise<any>; // options?: BiotaFactoryCollectionCreationOptions
  insertBatch: (data: object[], options: BiotaFrameworkCollectionInsertBatchOptions) => Promise<any>;
  replace: (id: FaunaId, data: object) => Promise<any>;
  update: (id: FaunaId, data: object) => Promise<any>;
  repsert: (id: FaunaId, data: object) => Promise<any>;
  upsert: (id: FaunaId, data: object) => Promise<any>;
  delete: (id: FaunaId) => Promise<any>;
  forget: (id: FaunaId) => Promise<any>;
  drop: () => Promise<any>;
  activity: (pagination: FaunaPaginateOptions) => Promise<any>;
  changes: () => Promise<any>;
}

export type BiotaFrameworkRelationPartRelation = "many" | "one";

export interface BiotaFrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface BiotaFrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface BiotaFrameworkCollectionScaffoldOptions {
  searchable?: string[];
  viewable?: BiotaFrameworkCollectionValueOptions[];
  fields?: BiotaFrameworkCollectionFieldOptions[];
  roles?: string[];
}

export interface BiotaFrameworkCollectionInsertBatchOptions {
  batchSize?: number;
  keepId?: boolean;
}

export interface BiotaFrameworkCollectionValueOptions {
  field?: string;
  binding?: Fauna.Expr;
  values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  data?: any;
}

export interface BiotaFrameworkCollectionFieldOptions {
  name?: string;
  field?: string;
  values?: FaunaIndexValue[];
  binding?: Fauna.Expr;
  ngram?: boolean;
  ngramMin?: number;
  ngramMax?: number;
  searchable?: boolean;
  reverse?: boolean;
  unique?: boolean;
  serialized?: boolean;
  permissions?: object;
  data?: any;
}

export interface BiotaFrameworkCollectionSearchParams {
  [path: string]: any;
}

export interface BiotaFrameworkFoundation {}

export interface BiotaFrameworkRelationDefinition {
  name: string;
  parts: BiotaFrameworkRelationPart[];
  destructive?: boolean;
}

export interface BiotaFrameworkRelationPart {
  relation: BiotaFrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface BiotaFrameworkRelation {}

export type BiotaFrameworkCollectionFieldOptionsAction = "compute" | "index";

export interface BiotaFrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface BiotaFrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface BiotaFrameworkCollectionScaffoldOptions {
  index?: (string | BiotaFrameworkCollectionFieldOptions)[];
  compute?: BiotaFrameworkCollectionFieldOptions[];
  field?: BiotaFrameworkCollectionFieldOptions[];
}

export interface BiotaFrameworkCollectionFieldOptions {
  field?: string;
  binding?: Fauna.Expr;
  inputs?: string[] | FaunaIndexTerm[];
  outputs?: string[] | FaunaIndexValue[];

  name?: string;
  // view
  action?: BiotaFrameworkCollectionFieldOptionsAction;
  // search
  ngram?: boolean;
  ngramMin?: number;
  ngramMax?: number;
  reverse?: boolean;
  // common
  // values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  permissions?: object;
  data?: any;
}

export interface BiotaFrameworkFoundation {}

export interface BiotaFrameworkRelationDefinition {
  name: string;
  parts: BiotaFrameworkRelationPart[];
  destructive?: boolean;
}

export interface BiotaFrameworkRelationPart {
  relation: BiotaFrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface BiotaFrameworkRelation {}
