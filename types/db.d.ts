import * as Fauna from "faunadb";
export { Fauna };

export type Fn<T = object> = (...args: any[]) => T;
export type ValueOptionsFn<T = object> = (
  value: String | T,
  options?: T
) => Fauna.Expr;
export type PromiseFn<T = object> = (...args: any[]) => Promise<T>;

export interface DBFactory {
  collection: (collectionName: string) => DBFactoryCollection;
  create: DBFactoryCreate;
  forget: DBFactoryForget;
  get: DBFactoryGet;
  me: DBFactoryMe;
  replace: DBFactoryReplace;
  repsert: DBFactoryRepsert;
  update: DBFactoryUpdate;
  upsert: DBFactoryUpsert;
}

export interface DBFactoryQueryOptions {
  logged?: boolean;
  secret?: string;
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
export type FaunaPaginateMapper = Fauna.Expr;
export interface FaunaPaginateOptions {
  ts?: Fauna.Expr;
  after?: Fauna.Expr;
  before?: Fauna.Expr;
  size?: number;
  events?: boolean;
}

export interface FaunaPaginateResponse {
  data: Fauna.Expr[];
  after: Fauna.Expr[];
  before: Fauna.Expr[];
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

export interface DBFactoryGet {
  get: (ref: FaunaRef) => Fauna.Expr;
  collections: () => Fauna.Expr;
  indexes: () => Fauna.Expr;
  functions: () => Fauna.Expr;
  roles: () => Fauna.Expr;
  keys: () => Fauna.Expr;
  tokens: () => Fauna.Expr;
  credentials: () => Fauna.Expr;
}

export interface DBFactoryCreate {
  // document?: (data: object, options?: FaunaDocumentOptions) => Fauna.Expr;
  database?: ValueOptionsFn<FaunaDatabaseOptions>;
  collection?: ValueOptionsFn<FaunaCollectionOptions>;
  index?: ValueOptionsFn<FaunaIndexOptions>;
  function?: ValueOptionsFn<FaunaFunctionOptions>;
  role?: ValueOptionsFn<FaunaRoleOptions>;
  token?: (ref: FaunaRef, options: FaunaTokenOptions) => Fauna.Expr;
  key?: (options: FaunaKeyOptions) => Fauna.Expr;
}

export interface DBFactoryUpsert {
  database?: ValueOptionsFn<FaunaDatabaseOptions>;
  collection?: ValueOptionsFn<FaunaCollectionOptions>;
  index?: ValueOptionsFn<FaunaIndexOptions>;
  function?: ValueOptionsFn<FaunaFunctionOptions>;
  role?: ValueOptionsFn<FaunaRoleOptions>;
  token?: (name: FaunaId, options: FaunaTokenOptions) => Fauna.Expr;
  key?: (name: FaunaId, options: FaunaKeyOptions) => Fauna.Expr;
}

export interface DBFactoryUpdate {
  database?: ValueOptionsFn<FaunaDatabaseOptions>;
  collection?: ValueOptionsFn<FaunaCollectionOptions>;
  index?: ValueOptionsFn<FaunaIndexOptions>;
  function?: ValueOptionsFn<FaunaFunctionOptions>;
  role?: ValueOptionsFn<FaunaRoleOptions>;
  token?: (name: FaunaId, options: FaunaTokenOptions) => Fauna.Expr;
  key?: (name: FaunaId, options: FaunaKeyOptions) => Fauna.Expr;
}

export interface DBFactoryRepsert {
  database?: ValueOptionsFn<FaunaDatabaseOptions>;
  collection?: ValueOptionsFn<FaunaCollectionOptions>;
  index?: ValueOptionsFn<FaunaIndexOptions>;
  function?: ValueOptionsFn<FaunaFunctionOptions>;
  role?: ValueOptionsFn<FaunaRoleOptions>;
  token?: (name: FaunaId, options: FaunaTokenOptions) => Fauna.Expr;
  key?: (name: FaunaId, options: FaunaKeyOptions) => Fauna.Expr;
}

export interface DBFactoryReplace {
  database?: (name: string, options: FaunaDatabaseOptions) => Fauna.Expr;
  collection?: (name: string, options: FaunaCollectionOptions) => Fauna.Expr;
  index?: (name: string, options: FaunaIndexOptions) => Fauna.Expr;
  function?: (name: string, options: FaunaFunctionOptions) => Fauna.Expr;
  role?: (name: string, options: FaunaRoleOptions) => Fauna.Expr;
  token?: (name: FaunaId, options: FaunaTokenOptions) => Fauna.Expr;
  key?: (name: FaunaId, options: FaunaKeyOptions) => Fauna.Expr;
}

export interface DBFactoryForget {
  database?: (name: string) => Fauna.Expr;
  collection?: (name: string) => Fauna.Expr;
  index?: (name: string) => Fauna.Expr;
  function?: (name: string) => Fauna.Expr;
  role?: (name: string) => Fauna.Expr;
  token?: (id: FaunaId) => Fauna.Expr;
  key?: (id: FaunaId) => Fauna.Expr;
}

export interface DBFactoryMe {
  logout?: (everywhere: boolean) => Fauna.Expr;
  get?: () => Fauna.Expr;
  update?: (data: any) => Fauna.Expr;
  upsert?: (data: any) => Fauna.Expr;
  delete?: () => Fauna.Expr;
  forget?: () => Fauna.Expr;
  changePassword?: Fn<Fauna.Expr>;
}

export interface DBFactoryCollectionCreationOptions {
  id?: FaunaId;
  password?: String;
}

export interface DBFrameworkDefault {
  rules: object;
}

export interface DBFrameworkGraphQL {
  _empty?: String;
}

export interface DBFrameworkImport {
  _empty?: String;
}

export interface DBFactoryCollection {
  list?: () => Fauna.Expr;
  login?: (password: string, id?: FaunaId) => Fauna.Expr;
  logout?: (everywhere: boolean) => Fauna.Expr;
  changePassword?: (password: string) => Fauna.Expr;
  get?: (id: FaunaId) => Fauna.Expr;
  import?: (
    data: object,
    options?: DBFactoryCollectionImportOptions
  ) => Fauna.Expr;
  create?: (
    data: object,
    options?: DBFactoryCollectionCreationOptions
  ) => Fauna.Expr;
  update?: (data: object, id: FaunaId) => Fauna.Expr;
  upsert?: (data: object, id: FaunaId) => Fauna.Expr;
  replace?: (data: object, id: FaunaId) => Fauna.Expr;
  repsert?: (data: object, id: FaunaId) => Fauna.Expr;
  delete?: (id: FaunaId) => Fauna.Expr;
  forget?: (id: FaunaId) => Fauna.Expr;
  keys?: Fn<Fauna.Expr>;
  batch?: DBFactoryCollectionBatch;
}

export interface DBFactoryCollectionImportOptions {
  id?: string;
  password?: string;
}

export interface DBFactoryCollectionBatch {
  get?: Fn<Fauna.Expr>;
  create?: Fn<Fauna.Expr>;
  update?: Fn<Fauna.Expr>;
  upsert?: Fn<Fauna.Expr>;
  delete?: Fn<Fauna.Expr>;
  forget?: Fn<Fauna.Expr>;
}

export interface DBFramework {
  collection: DBFrameworkCollectionFunction;
  document: DBFrameworkDocumentFunction;
}

export type DBFrameworkCollectionFunction = (
  collectionName: string | FaunaCollectionOptions
) => DBFrameworkCollection;

export type DBFrameworkDocumentFunction = (
  docRef: FaunaRef
) => DBFrameworkDocument;

export interface DBFrameworkCollectionSearchableOptions {
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
  viewable: (
    value: DBFrameworkCollectionValueOptions,
    options?: DBFrameworkCollectionSearchableOptions
  ) => any;
  searchable: (
    field: string | string[] | DBFrameworkCollectionFieldOptions,
    options?: DBFrameworkCollectionSearchableOptions
  ) => any;
  autocomplete: (
    field: string | string[] | DBFrameworkCollectionFieldOptions,
    options?: DBFrameworkCollectionSearchableOptions
  ) => any;
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
  import: (
    data: any | any[],
    options?: DBFrameworkCollectionImportOptions
  ) => Promise<any>;
}

export interface DBFrameworkCollectionImportOptions {
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

export interface FaunaIndexOptions {
  name?: string;
  source?: FaunaIndexSource;
  terms?: FaunaIndexTerm[];
  values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  permissions?: object;
  data?: any;
  active?: boolean;
  // addTerm?: Fn<FaunaIndexOptions>;
  // addValue?: Fn<FaunaIndexOptions>;
  // setData?: Fn<FaunaIndexOptions>;
  // toJSON?: Fn<any>;
}

export interface FaunaIndexSource {
  collection?: FaunaRef;
  fields?: FaunaIndexSourceFields;
}

export interface FaunaIndexSourceFields {
  [field: string]: Fauna.Expr;
}

export interface FaunaIndexTerm {
  field?: string | string[];
  binding?: string;
  reverse?: boolean;
}

export interface FaunaIndexValue {
  field?: string[];
  binding?: string;
  reverse?: boolean;
}

export interface FaunaCollectionOptions {
  name?: string;
  data?: object;
  history_days?: number;
  ttl_days?: number;
}

export interface FaunaDatabaseOptions {
  name?: string;
  data?: object;
  api_version?: number;
}

// export interface FaunaDocumentOptions {
//   data?: object;
//   credentials?: FaunaDocumentOptionsCredentials;
// }

// export interface FaunaDocumentOptionsCredentials {
//   password?: string;
// }

export type FaunaRuleAction =
  | "self"
  | "owner"
  | "not_owner"
  | "assignee"
  | "not_assignee"
  | "all"
  | "none";

export type FaunaRuleLambda = Fauna.Expr | Fn<Fauna.Expr>;

export interface FaunaRule {
  name?: string;
  lambda?: FaunaRuleLambda;
  query?: Fauna.Expr;
}

export interface FaunaKeyOptions {
  name?: string;
  database?: FaunaRef;
  role?: string;
  data?: object;
}

export interface FaunaTokenOptions {
  name?: string;
  data?: object;
}

export interface FaunaFunctionOptions {
  name?: string;
  body?: Fauna.Expr;
  data?: object;
  role?: FaunaRef | string;
}

export interface FaunaRoleOptions {
  name?: string;
  membership?: FaunaRoleMembership;
  privileges?: FaunaRolePrivilege[];
  setMembership?: Fn<any>;
  addPrivilege?: Fn<any>;
}

export interface FaunaRoleMembership {
  resource?: Fauna.Expr;
  predicate?: Fauna.Expr;
}

export interface FaunaRolePrivilege {
  resource?: Fauna.Expr;
  actions?: FaunaRolePrivilegeActions;
}

export interface FaunaRolePrivilegeActions {
  create?: Fauna.Expr | boolean;
  delete?: Fauna.Expr | boolean;
  read?: Fauna.Expr | boolean;
  write?: Fauna.Expr | boolean;
  history_read?: Fauna.Expr | boolean;
  history_write?: Fauna.Expr | boolean;
  unrestricted_read?: Fauna.Expr | boolean;
  call?: Fauna.Expr | boolean;
}

export interface FaunaRolePrivilegeDefault {
  resource?: Fauna.Expr;
  actions?: FaunaRolePrivilegeActionsDefault;
}

export interface FaunaRolePrivilegeActionsDefault {
  create?: Fauna.Expr | FaunaRuleAction;
  delete?: Fauna.Expr | FaunaRuleAction;
  read?: Fauna.Expr | FaunaRuleAction;
  write?: Fauna.Expr | FaunaRuleAction;
  history_read?: Fauna.Expr | FaunaRuleAction;
  history_write?: Fauna.Expr | FaunaRuleAction;
  unrestricted_read?: Fauna.Expr | FaunaRuleAction;
  call?: Fauna.Expr | FaunaRuleAction;
}

export interface ReferenceBuilder {
  collection?: FaunaCollection;
  id?: FaunaId;
  ref?: FaunaRef;
}

export type FaunaTime =
  | {
      time: number | string;
    }
  | Fauna.Expr;

export type FaunaCollection = string | Fauna.Expr;
export type FaunaId = string | Fauna.Expr;
export type FaunaRefCollection = {
  collection: FaunaCollection;
};

export type FaunaRef =
  | {
      ref: FaunaRefCollection;
      id: FaunaId;
    }
  | Fauna.Expr;

export type DocumentBase = {
  [key: string]: any;
  activity?: DocumentActivity;
};

export interface UserRights {
  roles?: FaunaRef[];
}

export type ActionName =
  | "create"
  | "update"
  | "replace"
  | "delete"
  | "forget"
  | "credentials"
  | "assign"
  | "own"
  | "import"
  | "expire"
  | "archive";

export interface Action {
  document: FaunaRef;
  ts: number;
  user: FaunaRef;
  name: ActionName;
}

export interface DocumentAccess {
  owner?: FaunaRef;
  assignees?: FaunaRef[];
  roles?: String[];
}

export interface DocumentActivity {
  assigned_by?: FaunaRef;
  assigned_at?: FaunaTime;

  owner_changed_by?: FaunaRef;
  owner_changed_at?: FaunaTime;

  credentials_changed_by?: FaunaRef;
  credentials_changed_at?: FaunaTime;

  imported_by?: FaunaRef;
  imported_at?: FaunaTime;

  created_by?: FaunaRef;
  created_at?: FaunaTime;

  updated_by?: FaunaRef;
  updated_at?: FaunaTime;

  replaced_by?: FaunaRef;
  replaced_at?: FaunaTime;

  expired_by?: FaunaRef;
  expired_at?: FaunaTime;

  deleted_by?: FaunaRef;
  deleted_at?: FaunaTime;

  archived_by?: FaunaRef;
  archived_at?: FaunaTime;

  hidden_by?: FaunaRef;
  hidden_at?: FaunaTime;
}
