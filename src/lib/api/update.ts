import { query as q } from 'faunadb'
import { DBUpdate, FaunaIndexOptions } from '~/types'
import { DB } from '~/index'

export const update: DBUpdate = {
  database: function databaseUpdate(this: DB, name: string, options) {
    return q.Update(q.Database(name), options)
  },
  collection: function collectionUpdate(this: DB, name: string, options) {
    return q.Update(q.Collection(name), options)
  },
  index: function indexUpdate(this: DB, name: string, options: FaunaIndexOptions) {
    return q.Update(q.Index(name), options)
  },
  function: function functionUpdate(this: DB, name: string, options) {
    return q.Update(q.Function(name), {})
  },
  role: function roleUpdate(this: DB, name: string, options) {
    return q.Update(q.Role(name), {})
  }
  // token: function tokenUpdate(id: FaunaId, options) {
  //   return (q.Update(q.Ref(q.Tokens(), id), {}))
  // },
  // key: function keyUpdate(id: FaunaId, options) {
  //   return (q.Update(q.Ref(q.Keys(), id), {}))
  // }
}
