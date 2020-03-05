import * as fauna from 'faunadb'

type Fn<T = object> = (...args: any[]) => T
type PromiseFn<T = object> = (...args: any[]) => Promise<T>

interface DB {
  q: any
  client: fauna.Client
  query<T = object>(expr: fauna.Expr, options?: fauna.QueryOptions): Promise<T>
  scaffold?: PromiseFn<void>

  collections?: PromiseFn
  indexes?: PromiseFn
  functions?: PromiseFn
  roles?: PromiseFn
  create?: DBCreate
  update?: DBUpdate
  upsert?: DBUpsert
  replace?: DBReplace
  forget?: DBForget
  collection?: Fn<DBCollection>
}

interface DBCreate {
  collection?: PromiseFn
  indexe?: PromiseFn
  function?: PromiseFn
  role?: PromiseFn
}

interface DBUpdate {
  collection?: PromiseFn
  indexe?: PromiseFn
  function?: PromiseFn
  role?: PromiseFn
}

interface DBUpsert {
  collection?: PromiseFn
  indexe?: PromiseFn
  function?: PromiseFn
  role?: PromiseFn
}

interface DBReplace {
  collection?: PromiseFn
  indexe?: PromiseFn
  function?: PromiseFn
  role?: PromiseFn
}

interface DBForget {
  collection?: PromiseFn
  indexe?: PromiseFn
  function?: PromiseFn
  role?: PromiseFn
}

interface DBCollection {
  get?: PromiseFn
  create?: PromiseFn
  update?: PromiseFn
  upsert?: PromiseFn
  delete?: PromiseFn
  forget?: PromiseFn
  login?: PromiseFn
  logout?: PromiseFn
  credentials?: PromiseFn
  keys?: PromiseFn
  batch?: DBCollectionBatch
  field?: PromiseFn
  index?: PromiseFn
}

interface DBCollectionBatch {
  get?: PromiseFn
  create?: PromiseFn
  update?: PromiseFn
  upsert?: PromiseFn
  delete?: PromiseFn
  forget?: PromiseFn
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

interface UserRoles {
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
