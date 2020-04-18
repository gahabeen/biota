import { FactoryCollectionApi, FactoryCollection } from '~/types/factory/factory.collection';
import { Fauna, FaunaCollectionOptions, FaunaIndexTerm, FaunaIndexValue, FaunaPaginateMapper, FaunaPaginateOptions } from '../fauna';

export type FrameworkCollection = FactoryCollection<FrameworkCollectionApi>;

export interface FrameworkCollectionApi {
  scaffold: (collectionDefinition: FaunaCollectionOptions, options?: FrameworkCollectionScaffoldOptions) => Promise<any>;
  field: (field: string | FrameworkCollectionFieldOptions) => Promise<any>;
  index: (field: string | FrameworkCollectionFieldOptions, options?: FrameworkIndexOptions) => Promise<any>;
  compute: (field: FrameworkCollectionFieldOptions, options?: FrameworkIndexOptions) => Promise<any>;
  // custom crud
  find: (searchQuery?: FrameworkCollectionSearchParams, pagination?: FaunaPaginateOptions) => Promise<any>;
  paginate(
    searchTerms?: FrameworkCollectionSearchParams,
    pagination?: FaunaPaginateOptions,
    mapper?: FaunaPaginateMapper,
  ): AsyncGenerator<any, any, any>;
  paginateAll(pagination?: FaunaPaginateOptions): Promise<any>;
  insertBatch: (data: object[], options: FrameworkCollectionInsertBatchOptions) => Promise<any>;
  // basic crud
  activity(pagination?: FaunaPaginateOptions): Promise<any>;
  findAll: FactoryCollectionApi<Promise<any>>['findAll'];
  get: FactoryCollectionApi<Promise<any>>['get'];
  insert: FactoryCollectionApi<Promise<any>>['insert'];
  update: FactoryCollectionApi<Promise<any>>['update'];
  upsert: FactoryCollectionApi<Promise<any>>['upsert'];
  replace: FactoryCollectionApi<Promise<any>>['replace'];
  repsert: FactoryCollectionApi<Promise<any>>['repsert'];
  delete: FactoryCollectionApi<Promise<any>>['delete'];
  forget: FactoryCollectionApi<Promise<any>>['forget'];
  restore: FactoryCollectionApi<Promise<any>>['restore'];
  expireAt: FactoryCollectionApi<Promise<any>>['expireAt'];
  expireIn: FactoryCollectionApi<Promise<any>>['expireIn'];
  expireNow: FactoryCollectionApi<Promise<any>>['expireNow'];
  drop: FactoryCollectionApi<Promise<any>>['drop'];
}

export type FrameworkRelationPartRelation = 'many' | 'one';

export interface FrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface FrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface FrameworkCollectionScaffoldOptions {
  searchable?: string[];
  viewable?: FrameworkCollectionValueOptions[];
  fields?: FrameworkCollectionFieldOptions[];
  roles?: string[];
}

export interface FrameworkCollectionInsertBatchOptions {
  batchSize?: number;
  keepId?: boolean;
}

export interface FrameworkCollectionValueOptions {
  field?: string;
  binding?: Fauna.Expr;
  values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  data?: any;
}

export interface FrameworkCollectionFieldOptions {
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

export interface FrameworkCollectionSearchParams {
  [path: string]: any;
}

export interface FrameworkRelationDefinition {
  name: string;
  parts: FrameworkRelationPart[];
  destructive?: boolean;
}

export interface FrameworkRelationPart {
  relation: FrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface FrameworkRelation {}

export type FrameworkCollectionFieldOptionsAction = 'compute' | 'index';

export interface FrameworkIndexOptions {
  role?: string | string[];
  roles?: string[];
  maxLength?: number;
}

export interface FrameworkDocument {
  get: () => Promise<any>;
  view: (field: string | string[]) => Promise<any>;
}

export interface FrameworkCollectionScaffoldOptions {
  index?: (string | FrameworkCollectionFieldOptions)[];
  compute?: FrameworkCollectionFieldOptions[];
  field?: FrameworkCollectionFieldOptions[];
}

export interface FrameworkCollectionFieldOptions {
  field?: string;
  binding?: Fauna.Expr;
  inputs?: string[] | FaunaIndexTerm[];
  outputs?: string[] | FaunaIndexValue[];

  name?: string;
  // view
  action?: FrameworkCollectionFieldOptionsAction;
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

export interface FrameworkFoundation {}

export interface FrameworkRelationDefinition {
  name: string;
  parts: FrameworkRelationPart[];
  destructive?: boolean;
}

export interface FrameworkRelationPart {
  relation: FrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface FrameworkRelation {}
