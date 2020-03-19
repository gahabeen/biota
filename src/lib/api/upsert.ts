import { query as q } from 'faunadb'
import { DBUpsert, FaunaCollectionOptions, FaunaIndexOptions } from '~/types'
import { DB } from '~/index'

export const upsert: DBUpsert = {
  database: function databaseUpsert(this: DB, name: string) {
    return q.If(q.Exists(q.Database(name)), this.update.database(name, {}), this.create.database(name, {}))
  },
  collection: function collectionUpsert(this: DB, name: string, options: FaunaCollectionOptions) {
    return q.If(q.Exists(q.Collection(name)), this.update.collection(name, options), this.create.collection(name, options))
  },
  index: function indexUpsert(this: DB, name: string, options: FaunaIndexOptions) {
    return q.If(q.Exists(q.Index(name)), this.update.index(name, options), this.create.index(name, options))
  },
  function: function functionUpsert(this: DB, name: string) {
    return q.If(q.Exists(q.Function(name)), this.update.function(name, {}), this.create.function(name, {}))
  },
  role: function roleUpsert(this: DB, name: string) {
    return q.If(q.Exists(q.Role(name)), this.update.role(name, {}), this.create.role(name, {}))
  }
  // token: function tokenUpsert(id: FaunaId) {
  //   return (q.If(q.Exists(q.Ref(q.Tokens(), id)), update.token(id, {}), create.token(id, {})))
  // },
  // key: function keyUpsert(id: FaunaId, opt) {
  //   return (q.If(q.Exists(q.Ref(q.Keys(), id)), update.key(opt), create.key(opt)))
  // }
}
