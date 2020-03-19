// types
import { DBMe } from '~/types'
// external
import { query as q } from 'faunadb'
// biota
import { DB } from '~/index'

export const me: DBMe = {
  logout: function meLogout(this: DB, everywhere) {
    return this.collection('users').logout(everywhere)
  },
  changePassword: function meChangePassword(this: DB, password: string) {
    return this.collection('users').changePassword(password)
  },
  get: function meGet(this: DB) {
    return this.collection('users').get(q.Select('id', q.Identity()))
  },
  update: function meUpdate(this: DB, data) {
    return this.collection('users').update(q.Select('id', q.Identity()), data)
  },
  upsert: function meUpsert(this: DB, data) {
    return this.collection('users').upsert(q.Select('id', q.Identity()), data)
  },
  delete: function meDelete(this: DB) {
    return this.collection('users').delete(q.Select('id', q.Identity()))
  },
  forget: function meForget(this: DB) {
    return this.collection('users').forget(q.Select('id', q.Identity()))
  }
}
