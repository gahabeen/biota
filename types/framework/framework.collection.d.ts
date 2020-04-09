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

export interface DBFrameworkCollectionApi {
  // builder
  scaffold: (collectionDefinition: FaunaCollectionOptions, options?: DBFrameworkCollectionScaffoldOptions) => Promise<any>;
  field: (field: string | DBFrameworkCollectionFieldOptions) => Promise<any>;
  index: (field: string | DBFrameworkCollectionFieldOptions, options?: DBFrameworkIndexOptions) => Promise<any>;
  compute: (field: DBFrameworkCollectionFieldOptions, options?: DBFrameworkIndexOptions) => Promise<any>;

  // custom crud
  find: (searchQuery?: DBFrameworkCollectionSearchParams, pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper) => Promise<any>;
  findAll(pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper): Promise<any>;
  paginate: (
    searchTerms?: DBFrameworkCollectionSearchParams,
    pagination?: FaunaPaginateOptions,
    mapper?: FaunaPaginateMapper
  ) => AsyncGenerator<any, any, any>;
  paginateAll(pagination?: FaunaPaginateOptions, mapper?: FaunaPaginateMapper): Promise<any>;

  // basic crud
  get: (id: FaunaId) => Promise<any>;
  // #bug recreate the options type!
  insert: (data: object) => Promise<any>; // options?: DBFactoryCollectionCreationOptions
  insertBatch: (data: object[], options: DBFrameworkCollectionInsertBatchOptions) => Promise<any>;
  replace: (id: FaunaId, data: object) => Promise<any>;
  update: (id: FaunaId, data: object) => Promise<any>;
  repsert: (id: FaunaId, data: object) => Promise<any>;
  upsert: (id: FaunaId, data: object) => Promise<any>;
  delete: (id: FaunaId) => Promise<any>;
  forget: (id: FaunaId) => Promise<any>;
  clean: () => Promise<any>;
  activity: (pagination: FaunaPaginateOptions) => Promise<any>;
  changes: () => Promise<any>;
}

export type DBFrameworkRelationPartRelation = "many" | "one";

export interface DBFrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface DBFrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface DBFrameworkCollectionScaffoldOptions {
  searchable?: string[];
  viewable?: DBFrameworkCollectionValueOptions[];
  fields?: DBFrameworkCollectionFieldOptions[];
  roles?: string[];
}

export interface DBFrameworkCollectionInsertBatchOptions {
  batchSize?: number;
  keepId?: boolean;
}

export interface DBFrameworkCollectionValueOptions {
  field?: string;
  binding?: Fauna.Expr;
  values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  data?: any;
}

export interface DBFrameworkCollectionFieldOptions {
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

export interface DBFrameworkCollectionSearchParams {
  [path: string]: any;
}

export interface DBFrameworkFoundation {}

export interface DBFrameworkRelationDefinition {
  name: string;
  parts: DBFrameworkRelationPart[];
  destructive?: boolean;
}

export interface DBFrameworkRelationPart {
  relation: DBFrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface DBFrameworkRelation {}

export type DBFrameworkCollectionFieldOptionsAction = "compute" | "index";

export interface DBFrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface DBFrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface DBFrameworkCollectionScaffoldOptions {
  index?: (string | DBFrameworkCollectionFieldOptions)[];
  compute?: DBFrameworkCollectionFieldOptions[];
  field?: DBFrameworkCollectionFieldOptions[];
}

export interface DBFrameworkCollectionFieldOptions {
  field?: string;
  binding?: Fauna.Expr;
  inputs?: string[] | FaunaIndexTerm[];
  outputs?: string[] | FaunaIndexValue[];

  name?: string;
  // view
  action?: DBFrameworkCollectionFieldOptionsAction;
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

export interface DBFrameworkFoundation {}

export interface DBFrameworkRelationDefinition {
  name: string;
  parts: DBFrameworkRelationPart[];
  destructive?: boolean;
}

export interface DBFrameworkRelationPart {
  relation: DBFrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface DBFrameworkRelation {}
