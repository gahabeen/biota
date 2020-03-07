import * as fauna from 'faunadb'

type Fn<T = object> = (...args: any[]) => T
type PromiseFn<T = object> = (...args: any[]) => Promise<T>

interface DB {
  q: any
  client: fauna.Client
  query<T = object>(expr: fauna.Expr, options?: fauna.QueryOptions): Promise<T>
  fql(fql: fauna.Expr): DBFqlWrapper
  scaffold?: Fn<void>

  collections?: Fn<DBFqlWrapper>
  indexes?: Fn<DBFqlWrapper>
  functions?: Fn<DBFqlWrapper>
  roles?: Fn<DBFqlWrapper>
  create?: DBCreate
  update?: DBUpdate
  upsert?: DBUpsert
  replace?: DBReplace
  forget?: DBForget
  collection?: Fn<DBCollection>
}

interface DBFqlWrapper {
  fql: object
  query: PromiseFn<any>
}

interface DBCreate {
  collection?: Fn<DBFqlWrapper>
  indexe?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBUpdate {
  collection?: Fn<DBFqlWrapper>
  indexe?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBUpsert {
  collection?: Fn<DBFqlWrapper>
  indexe?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBReplace {
  collection?: Fn<DBFqlWrapper>
  indexe?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBForget {
  collection?: Fn<DBFqlWrapper>
  indexe?: Fn<DBFqlWrapper>
  function?: Fn<DBFqlWrapper>
  role?: Fn<DBFqlWrapper>
}

interface DBCollection {
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

interface FaunaRule {
  name?: string
  lambda?: fauna.Expr | Fn<fauna.Expr>
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
  owned_by?: FaunaRef

  assigned_to?: FaunaRef[]
  assigned_at?: FaunaTime

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
