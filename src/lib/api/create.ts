// types
import { FaunaRef, DBCreate, FaunaDatabaseOptions, FaunaCollectionOptions, FaunaIndexOptions, FaunaRole, Fauna.Expr } from '~/types'
// external
import { query as q } from 'faunadb'
// biota
import { Collection } from '~/lib/collection'

export const create: DBCreate = {
  database: function databaseCreate(name: string, options: FaunaDatabaseOptions = {}) {
    return q.CreateDatabase({
      name,
      ...options
    })
  },
  collection: function collectionCreate(name: string, options: FaunaCollectionOptions = {}) {
    return q.CreateCollection(
      Collection({
        name,
        ...options
      })
    )
  },
  index: function indexCreate(name: string, options: FaunaIndexOptions) {
    return q.CreateIndex({
      name,
      ...options
    })
  },
  function: function functionCreate(name: string, options) {
    return q.CreateFunction({
      name
    })
  },
  role: function roleCreate(nameOrDefinition: string | FaunaRole, andDefinition: FaunaRole = {}): Fauna.Expr {
    let name = typeof nameOrDefinition === 'string' ? nameOrDefinition : undefined
    let definition = typeof nameOrDefinition === 'object' ? nameOrDefinition : andDefinition
    return q.CreateRole({ name, ...definition })
  },
  token: function tokenCreate(ref: FaunaRef) {
    return q.Create(q.Tokens(), { instance: ref })
  },
  key: function keyCreate(opt) {
    return q.CreateKey(opt)
  }
}
