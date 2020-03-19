// types
import { DBReplace, FaunaId } from '~/types'
// external
import { query as q } from 'faunadb'
// biota
import { DB } from '~/index'

export const replace: DBReplace = {
  database: function databaseReplace(this: DB, name: string, options) {
    return q.Replace(q.Database(name), {})
  },
  collection: function collectionReplace(this: DB, name: string, options) {
    return q.Replace(q.Collection(name), {})
  },
  index: function indexReplace(this: DB, name: string, options) {
    return q.Replace(q.Index(name), {})
  },
  function: function fuctionReplace(this: DB, name: string, options) {
    return q.Replace(q.Function(name), {})
  },
  role: function roleReplace(this: DB, name: string, options) {
    return q.Replace(q.Role(name), {})
  },
  token: function tokenReplace(this: DB, id: FaunaId, options) {
    return q.Replace(q.Ref(q.Tokens(), id), options)
  },
  key: function keyReplace(this: DB, id: FaunaId, options) {
    return q.Replace(q.Ref(q.Keys(), id), options)
  }
}
