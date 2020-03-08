import * as fauna from 'faunadb'

type Fn<T = object> = (...args: any[]) => T
type PromiseFn<T = object> = (...args: any[]) => Promise<T>

// interface DB {
//   q: any
//   client: fauna.Client
//   query<T = object>(expr: fauna.Expr, options?: DBQueryOptions): Promise<T>
//   fql(fql: fauna.Expr): DBFqlWrapper
//   login(id: fauna.Expr, password: string): Promise<DB>
//   scaffold?: Fn<void>

//   collections?: Fn<DBFqlWrapper>
//   indexes?: Fn<DBFqlWrapper>
//   functions?: Fn<DBFqlWrapper>
//   roles?: Fn<DBFqlWrapper>
//   keys?: Fn<DBFqlWrapper>
//   credentials?: Fn<DBFqlWrapper>

//   collection?: Fn<DBCollection>
//   create?: DBCreate
//   update?: DBUpdate
//   upsert?: DBUpsert
//   replace?: DBReplace
//   forget?: DBForget
//   me?: DBMe
// }

interface DBQueryOptions {
  logged?: boolean
  secret?: string
}

interface DBFqlWrapper {
  fql?: object
  query: PromiseFn<any>
  then: PromiseFn<any>
}

interface DBFqlWrapperOptions {
  then: PromiseFn<any>
}

interface DBScaffoldOptions {
  collections: any[]
  indexes: any[]
  roles: any[]
  functions: any[]
  documents: any[]
}

interface FaunaPaginate {
  ts: fauna.Expr
  after: fauna.Expr
  before: fauna.Expr
  size: number
  events: boolean
}

interface DBScaffold {
  collections?: DBScaffoldCollections
  indexes?: DBScaffoldIndexes
  functions?: DBScaffoldFunctions
  roles?: DBScaffoldRoles
}

interface DBScaffoldCollections {
  users?: Fn<DBFqlWrapper>
  activities?: Fn<DBFqlWrapper>
}

interface DBScaffoldIndexes {
  for?: Fn<DBFqlWrapper>
}

interface DBScaffoldFunctions {
  for?: Fn<DBFqlWrapper>
}

interface DBScaffoldRoles {
  for?: Fn<DBFqlWrapper>
}

interface DBCreate {
  collection?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
  batch?: DBCreateBatch
}

interface DBCreateBatch {
  collections?: Fn<DBFqlWrapper>
  indexes?: Fn<DBFqlWrapper>
  functions?: Fn<DBFqlWrapper>
  roles?: Fn<DBFqlWrapper>
}

interface DBUpdate {
  collection?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBUpsert {
  collection?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBReplace {
  collection?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBForget {
  collection?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBMe {
  logout?: Fn<DBFqlWrapper>
  get?: Fn<DBFqlWrapper>
  update?: Fn<DBFqlWrapper>
  upsert?: Fn<DBFqlWrapper>
  delete?: Fn<DBFqlWrapper>
  forget?: Fn<DBFqlWrapper>
  changePassword?: Fn<DBFqlWrapper>
}

interface DBCollection {
  list?: Fn<DBFqlWrapper>
  get?: Fn<DBFqlWrapper>
  create?: Fn<DBFqlWrapper>
  update?: Fn<DBFqlWrapper>
  upsert?: Fn<DBFqlWrapper>
  delete?: Fn<DBFqlWrapper>
  forget?: Fn<DBFqlWrapper>
  login?: Fn<DBFqlWrapper>
  logout?: Fn<DBFqlWrapper>
  changePassword?: Fn<DBFqlWrapper>
  keys?: Fn<DBFqlWrapper>
  batch?: DBCollectionBatch
  field?: Fn<DBFqlWrapper>
  index?: Fn<DBFqlWrapper>
}

interface DBCollectionBatch {
  get?: Fn<DBFqlWrapper>
  create?: Fn<DBFqlWrapper>
  update?: Fn<DBFqlWrapper>
  upsert?: Fn<DBFqlWrapper>
  delete?: Fn<DBFqlWrapper>
  forget?: Fn<DBFqlWrapper>
}

interface FaunaIndexOptions {
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
}

interface FaunaIndexSource {
  collection?: FaunaRef
  fields?: FaunaIndexSourceFields
}

interface FaunaIndexSourceFields {
  [field: string]: fauna.Expr
}

interface FaunaIndexTerm {
  field?: string | string[]
  binding?: string
  reverse?: boolean
}

interface FaunaIndexValue {
  field?: string | string[]
  binding?: string
  reverse?: boolean
}

interface FaunaCollectionOptions {
  name?: string
  data?: object
  history_days?: number
  ttl_days?: number
}

type FaunaRuleActionType = 'owner' | 'not_owner' | 'assignee' | 'not_assignee' | 'all' | 'none'

type FaunaRuleLambda = fauna.Expr | Fn<fauna.Expr>

interface FaunaRule {
  name?: string
  lambda?: FaunaRuleLambda
}

interface FaunaFunction {
  name?: string
  body?: fauna.Expr
  data?: object
  role?: FaunaRef | string
}

interface FaunaRole {
  name: string
  membership?: FaunaRoleMembership
  privileges?: FaunaRolePrivilege[]
  setMembership?: Fn<any>
  addPrivilege?: Fn<any>
}

interface FaunaRoleMembership {
  resource?: fauna.Expr
  predicate?: fauna.Expr
}

interface FaunaRolePrivilege {
  resource?: fauna.Expr
  actions?: FaunaRolePrivilegeActions
}

interface FaunaRolePrivilegeActions {
  create?: fauna.Expr | boolean
  delete?: fauna.Expr | boolean
  read?: fauna.Expr | boolean
  write?: fauna.Expr | boolean
  history_read?: fauna.Expr | boolean
  history_write?: fauna.Expr | boolean
  unrestricted_read?: fauna.Expr | boolean
  call?: fauna.Expr | boolean
}

interface FaunaRolePrivilegeDefault {
  resource?: fauna.Expr
  actions?: FaunaRolePrivilegeActionsDefault
}

interface FaunaRolePrivilegeActionsDefault {
  create?: FaunaRuleActionType
  delete?: FaunaRuleActionType
  read?: FaunaRuleActionType
  write?: FaunaRuleActionType
  history_read?: FaunaRuleActionType
  history_write?: FaunaRuleActionType
  unrestricted_read?: FaunaRuleActionType
  call?: FaunaRuleActionType
}

interface ReferenceBuilder {
  collection?: FaunaCollection
  id?: FaunaId
  ref?: FaunaRef
}

type FaunaTime =
  | {
      time: number | string
    }
  | fauna.Expr

type FaunaCollection = string | fauna.Expr
type FaunaId = string | fauna.Expr
type FaunaRefCollection = {
  collection: FaunaCollection
}

type FaunaRef =
  | {
      ref: FaunaRefCollection
      id: FaunaId
    }
  | fauna.Expr

type DocumentBase = {
  [key: string]: any
  activity?: DocumentActivity
}

interface UserRights {
  roles?: FaunaRef[]
}

interface DocumentActivity {
  assignees?: FaunaRef[]
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
