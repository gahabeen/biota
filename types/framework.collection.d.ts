export interface DBFrameworkDefault {
  rules: object;
}

export interface DBFrameworkGraphQL {
  _empty?: String;
}

export interface DBFrameworkImport {
  _empty?: String;
}

export interface DBFramework {
  collection: DBFrameworkCollectionFunction;
  document: DBFrameworkDocumentFunction;
}

export type DBFrameworkCollectionFunction = (collectionName: string | FaunaCollectionOptions) => DBFrameworkCollection;

export type DBFrameworkDocumentFunction = (docRef: FaunaRef) => DBFrameworkDocument;

export interface DBFrameworkCollectionIndexOptions {
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
}

export interface DBFrameworkCollection {
  value: (value: DBFrameworkCollectionValueOptions) => any;
  field: (field: string | DBFrameworkCollectionFieldOptions) => any;
  viewable: (value: DBFrameworkCollectionValueOptions, options?: DBFrameworkCollectionIndexOptions) => any;
  searchable: (field: string | string[] | DBFrameworkCollectionFieldOptions, options?: DBFrameworkCollectionIndexOptions) => any;
  autocomplete: (field: string | string[] | DBFrameworkCollectionFieldOptions, options?: DBFrameworkCollectionIndexOptions) => any;
  search: (
    searchQuery?: DBFrameworkCollectionSearchParams,
    paginateOptions?: FaunaPaginateOptions,
    mapper?: FaunaPaginateMapper
  ) => Promise<any>;
  paginate: (
    searchTerms?: DBFrameworkCollectionSearchParams,
    paginateOptions?: FaunaPaginateOptions,
    mapper?: FaunaPaginateMapper
  ) => AsyncGenerator<any, any, any>;
  scaffold: (options?: DBFrameworkCollectionScaffoldOptions) => any;
  import: (data: any | any[], options?: DBFrameworkCollectionInsertOptions) => Promise<any>;
}

export interface DBFrameworkCollectionInsertOptions {
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

export type DBFrameworkRelationPartRelation = "many" | "one";

export interface DBFrameworkRelationPart {
  relation: DBFrameworkRelationPartRelation;
  collection: string;
  path: string;
}

export interface DBFrameworkRelation {}
