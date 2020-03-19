import * as Fauna from 'faunadb'
export { Fauna }

export type Fn<T = object> = (...args: any[]) => T
export type PromiseFn<T = object> = (...args: any[]) => Promise<T>

export interface DBQueryOptions {
  logged?: boolean
  secret?: string
}

export interface DBFqlWrapper {
  fql?: object
  query?: PromiseFn<any>
  then?: PromiseFn<any>
}

export interface DBFqlWrapperOptions {
  then: PromiseFn<any>
}

export interface DBQL {
  Batch: Fn<any>
  Ref: Fn<FaunaRef>
}

export interface DBScaffoldOptions {
  collections?: any[]
  indexes?: any[]
  roles?: any[]
  functions?: any[]
  documents?: any[]
}

export interface FaunaPaginate {
  ts: Fauna.Expr
  after: Fauna.Expr
  before: Fauna.Expr
  size: number
  events: boolean
}

export interface DBScaffold {
  collection?: Fn<Fauna.Expr>
  collections?: DBScaffoldCollections
  indexes?: DBScaffoldIndexes
  functions?: DBScaffoldFunctions
  roles?: DBScaffoldRoles
}

export interface DBScaffoldCollections {
  defaults?: Fn<Fauna.Expr>
  users?: Fn<Fauna.Expr>
  activities?: Fn<Fauna.Expr>
}

export interface DBScaffoldIndexes {
  defaults?: Fn<Fauna.Expr>
  for?: Fn<Fauna.Expr>
}

export interface DBScaffoldFunctions {
  defaults?: Fn<Fauna.Expr>
  for?: Fn<Fauna.Expr>
}

export interface DBScaffoldRoles {
  defaults?: Fn<Fauna.Expr>
  for?: Fn<Fauna.Expr>
}

export interface DBCreate {
  database?: Fn<Fauna.Expr>
  collection?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
  function?: Fn<Fauna.Expr>
  role?: Fn<Fauna.Expr>
  token?: Fn<Fauna.Expr>
  key?: Fn<Fauna.Expr>
}

export interface DBUpdate {
  database?: Fn<Fauna.Expr>
  collection?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
  function?: Fn<Fauna.Expr>
  role?: Fn<Fauna.Expr>
  token?: Fn<Fauna.Expr>
  key?: Fn<Fauna.Expr>
}

export interface DBUpsert {
  database?: Fn<Fauna.Expr>
  collection?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
  function?: Fn<Fauna.Expr>
  role?: Fn<Fauna.Expr>
  token?: Fn<Fauna.Expr>
  key?: Fn<Fauna.Expr>
}

export interface DBReplace {
  database?: Fn<Fauna.Expr>
  collection?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
  function?: Fn<Fauna.Expr>
  role?: Fn<Fauna.Expr>
  token?: Fn<Fauna.Expr>
  key?: Fn<Fauna.Expr>
}

export interface DBForget {
  database?: Fn<Fauna.Expr>
  collection?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
  function?: Fn<Fauna.Expr>
  role?: Fn<Fauna.Expr>
  token?: Fn<Fauna.Expr>
  key?: Fn<Fauna.Expr>
}

export interface DBMe {
  logout?: Fn<Fauna.Expr>
  get?: Fn<Fauna.Expr>
  update?: Fn<Fauna.Expr>
  upsert?: Fn<Fauna.Expr>
  delete?: Fn<Fauna.Expr>
  forget?: Fn<Fauna.Expr>
  changePassword?: Fn<Fauna.Expr>
}

export interface DBCollection {
  list?: Fn<Fauna.Expr>
  get?: Fn<Fauna.Expr>
  create?: Fn<Fauna.Expr>
  update?: Fn<Fauna.Expr>
  upsert?: Fn<Fauna.Expr>
  delete?: Fn<Fauna.Expr>
  forget?: Fn<Fauna.Expr>
  login?: Fn<Fauna.Expr>
  logout?: Fn<Fauna.Expr>
  changePassword?: Fn<Fauna.Expr>
  keys?: Fn<Fauna.Expr>
  batch?: DBCollectionBatch
  field?: Fn<Fauna.Expr>
  index?: Fn<Fauna.Expr>
}

export interface DBCollectionBatch {
  get?: Fn<Fauna.Expr>
  create?: Fn<Fauna.Expr>
  update?: Fn<Fauna.Expr>
  upsert?: Fn<Fauna.Expr>
  delete?: Fn<Fauna.Expr>
  forget?: Fn<Fauna.Expr>
}

export interface FaunaIndexOptions {
  name?: string
  source?: FaunaIndexSource
  terms?: FaunaIndexTerm[]
  values?: FaunaIndexValue[]
  unique?: boolean
  serialized?: boolean
  permissions?: object
  data?: any
  addTerm?: Fn<FaunaIndexOptions>
  addValue?: Fn<FaunaIndexOptions>
  setData?: Fn<FaunaIndexOptions>
  toJSON?: Fn<any>
}

export interface FaunaIndexSource {
  collection?: FaunaRef
  fields?: FaunaIndexSourceFields
}

export interface FaunaIndexSourceFields {
  [field: string]: Fauna.Expr
}

export interface FaunaIndexTerm {
  field?: string | string[]
  binding?: string
  reverse?: boolean
}

export interface FaunaIndexValue {
  field?: string | string[]
  binding?: string
  reverse?: boolean
}

export interface FaunaCollectionOptions {
  name?: string
  data?: object
  history_days?: number
  ttl_days?: number
}

export interface FaunaDatabaseOptions {
  name?: string
  data?: object
  api_version?: number
}

export type FaunaRuleActionexport Type = 'owner' | 'not_owner' | 'assignee' | 'not_assignee' | 'all' | 'none'

export type FaunaRuleLambda = Fauna.Expr | Fn<Fauna.Expr>

export interface FaunaRule {
  name?: string
  lambda?: FaunaRuleLambda
  query?: Fauna.Expr
}

export interface FaunaFunction {
  name?: string
  body?: Fauna.Expr
  data?: object
  role?: FaunaRef | string
}

export interface FaunaRole {
  name?: string
  membership?: FaunaRoleMembership
  privileges?: FaunaRolePrivilege[]
  setMembership?: Fn<any>
  addPrivilege?: Fn<any>
}

export interface FaunaRoleMembership {
  resource?: Fauna.Expr
  predicate?: Fauna.Expr
}

export interface FaunaRolePrivilege {
  resource?: Fauna.Expr
  actions?: FaunaRolePrivilegeActions
}

export interface FaunaRolePrivilegeActions {
  create?: Fauna.Expr | boolean
  delete?: Fauna.Expr | boolean
  read?: Fauna.Expr | boolean
  write?: Fauna.Expr | boolean
  history_read?: Fauna.Expr | boolean
  history_write?: Fauna.Expr | boolean
  unrestricted_read?: Fauna.Expr | boolean
  call?: Fauna.Expr | boolean
}

export interface FaunaRolePrivilegeDefault {
  resource?: Fauna.Expr
  actions?: FaunaRolePrivilegeActionsDefault
}

export interface FaunaRolePrivilegeActionsDefault {
  create?: FaunaRuleActionexport Type
  delete?: FaunaRuleActionexport Type
  read?: FaunaRuleActionexport Type
  write?: FaunaRuleActionexport Type
  history_read?: FaunaRuleActionexport Type
  history_write?: FaunaRuleActionexport Type
  unrestricted_read?: FaunaRuleActionexport Type
  call?: FaunaRuleActionexport Type
}

export interface ReferenceBuilder {
  collection?: FaunaCollection
  id?: FaunaId
  ref?: FaunaRef
}

export type FaunaTime =
  | {
      time: number | string
    }
  | Fauna.Expr

export type FaunaCollection = string | Fauna.Expr
export type FaunaId = string | Fauna.Expr
export type FaunaRefCollection = {
  collection: FaunaCollection
}

export type FaunaRef =
  | {
      ref: FaunaRefCollection
      id: FaunaId
    }
  | Fauna.Expr

export type DocumentBase = {
  [key: string]: any
  activity?: DocumentActivity
}

export interface UserRights {
  roles?: FaunaRef[]
}

export type ActionName = 'create' | 'update' | 'replace' | 'delete' | 'forget' | 'credentials' | 'assign' | 'own' | 'import' | 'expire' | 'archive'

export interface Action {
  document: FaunaRef
  ts: number
  user: FaunaRef
  name: ActionName
}

export interface DocumentActivity {
  assignees?: FaunaRef[]
  assigned_by?: FaunaRef
  assigned_at?: FaunaTime

  owner?: FaunaRef
  owner_changed_by?: FaunaRef
  owner_changed_at?: FaunaTime

  credentials_changed_by?: FaunaRef
  credentials_changed_at?: FaunaTime

  imported_by?: FaunaRef
  imported_at?: FaunaTime

  created_by?: FaunaRef
  created_at?: FaunaTime

  updated_by?: FaunaRef
  updated_at?: FaunaTime

  replaced_by?: FaunaRef
  replaced_at?: FaunaTime

  expired_by?: FaunaRef
  expired_at?: FaunaTime

  deleted_by?: FaunaRef
  deleted_at?: FaunaTime

  archived_by?: FaunaRef
  archived_at?: FaunaTime
}
