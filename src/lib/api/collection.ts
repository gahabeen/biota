// types
import { DBCollection } from '~/types'
// external
import { query as q } from 'faunadb'
// biota
import { DB } from '~/index'
import { Reference } from '~/lib/ql'

export function collection(this: DB, name: string = undefined): DBCollection {
  return {
    list: function collectionList() {
      return q.Paginate(q.Documents(q.Collection(name)))
    },
    login: function collectionLogin(password, id) {
      return q.Login(Reference(id ? { collection: name, id } : q.Identity()), { password })
    },
    logout: function collectionLogout(everywhere) {
      return q.Logout(everywhere)
    },
    changePassword: function collectionChangePassword(password: string) {
      return q.Call('biota.ChangePassword', [q.Identity(), q.Identity(), password])
    },
    get: function collectionGet(id: string | object) {
      return q.Get(q.Ref(q.Collection(name), id))
    },
    create: function collectionCreate(data, { id, credentials }) {
      return q.Call('biota.Create', [q.Identity(), Reference({ collection: name, id }), { data, credentials }])
    },
    update: function collectionUpdate(id, data) {
      return q.Call('biota.Update', [q.Identity(), Reference({ collection: name, id }), { data }])
    },
    upsert: function collectionUpsert(id, data) {
      return q.If(q.Exists(Reference({ collection: name, id })), this.collection(name).update(id, data), this.collection(name).create(data, { id }))
    },
    delete: function collectionDelete(id) {
      return q.Update(Reference({ collection: name, id }), {})
    },
    forget: function collectionForget(id) {
      return q.Delete(Reference({ collection: name, id }))
    }
    // field() {},
    // index(options) {}
  }
}
