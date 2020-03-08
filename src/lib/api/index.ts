import * as fauna from 'faunadb'
import { query as q, Expr } from 'faunadb'
import { DBCreate, DBCollection, DBMe, DBUpdate, DBUpsert, DBReplace, DBForget, DBScaffold } from '../../types'

import * as functions from './../function'
import * as language from '../language/methods'

export const scaffold: DBScaffold = {
  collections: {
    users() {
      return this.fql()
    },
    activities() {
      return this.fql()
    }
  },
  indexes: {
    for(name: string) {
      return this.fql()
    }
  },
  functions: {
    for(name: string) {
      return this.fql()
    }
  },
  roles: {
    for(name: string) {
      return this.fql()
    }
  }
}

export const get = {
  collections: function collectionsGet() {
    return this.fql(q.Paginate(q.Collections(), {}))
  },
  indexes: function indexesGet() {
    return this.fql(q.Paginate(q.Indexes(), {}))
  },
  functions: function functionsGet() {
    return this.fql(q.Paginate(q.Functions(), {}))
  },
  roles: function rolesGet() {
    return this.fql(q.Paginate(q.Roles(), {}))
  },
  keys: function keysGet() {
    return this.fql(q.Paginate(q.Keys()))
  },
  credentials: function credentialsGet() {
    return this.fql(q.Paginate(q.Documents(q.Credentials())))
  }
}

export const create: DBCreate = {
  collection: function collectionCreate(name: string, opts) {
    return this.fql(
      q.CreateCollection({
        name
      })
    )
  },
  index: function indexCreate(name: string, opts) {
    return this.fql(
      q.CreateIndex({
        name
      })
    )
  },
  function: function functionCreate(name: string, opts) {
    return this.fql(
      q.CreateFunction({
        name
      })
    )
  },
  role: function roleCreate(name: string, opts) {
    return this.fql(
      q.CreateRole({
        name
      })
    )
  }
}

export const update: DBUpdate = {
  collection: function collectionUpdate(name: string, opts) {
    return this.fql(q.Update(q.Collection(name), {}))
  },
  index: function indexUpdate(name: string, opts) {
    return this.fql(q.Update(q.Index(name), {}))
  },
  function: function functionUpdate(name: string, opts) {
    return this.fql(q.Update(q.Function(name), {}))
  },
  role: function roleUpdate(name: string, opts) {
    return this.fql(q.Update(q.Role(name), {}))
  }
}

export const upsert: DBUpsert = {
  collection: function collectionUpsert(name: string) {
    return this.fql(q.If(q.Exists(q.Collection(name)), update.collection(name, {}), create.collection(name, {})))
  },
  index: function indexUpsert(name: string) {
    return this.fql(q.If(q.Exists(q.Index(name)), update.index(name, {}), create.index(name, {})))
  },
  function: function functionUpsert(name: string) {
    return this.fql(q.If(q.Exists(q.Function(name)), update.function(name, {}), create.function(name, {})))
  },
  role: function roleUpsert(name: string) {
    return this.fql(q.If(q.Exists(q.Role(name)), update.role(name, {}), create.role(name, {})))
  }
}

export const replace: DBReplace = {
  collection: function collectionReplace(name: string, opts) {
    return this.fql(q.Replace(q.Collection(name), {}))
  },
  index: function indexReplace(name: string, opts) {
    return this.fql(q.Replace(q.Index(name), {}))
  },
  function: function fuctionReplace(name: string, opts) {
    return this.fql(q.Replace(q.Function(name), {}))
  },
  role: function roleReplace(name: string, opts) {
    return this.fql(q.Replace(q.Role(name), {}))
  }
}

export const forget: DBForget = {
  collection: function collectionForget(name: string) {
    return this.fql(q.Delete(q.Collection(name)))
  },
  index: function indexForget(name: string) {
    return this.fql(q.Delete(q.Index(name)))
  },
  function: function functionForget(name: string) {
    return this.fql(q.Delete(q.Function(name)))
  },
  role: function roleForget(name: string) {
    return this.fql(q.Delete(q.Role(name)))
  }
}

export function collection(name: string = undefined): DBCollection {
  let self = this
  return {
    [Symbol('DBCollection')]: true,
    list: function collectionList() {
      return self.fql(q.Paginate(q.Documents(q.Collection(name))))
    },
    login: function collectionLogin(password, id) {
      return self.fql(q.Login(language.reference(id ? { collection: name, id } : q.Identity()), { password }))
    },
    logout: function collectionLogout(everywhere) {
      return self.fql(q.Logout(everywhere))
    },
    changePassword: function collectionChangePassword(password: string) {
      return self.fql(q.Call(functions.defaults.ChangePassword.name, [q.Identity(), q.Identity(), password]))
    },
    get: function collectionGet(id: string | object) {
      return self.fql(q.Get(q.Ref(q.Collection(name), id)))
    },
    create: function collectionCreate(data, { id, credentials }) {
      return self.fql(q.Call(functions.defaults.Create.name, [q.Identity(), language.reference({ collection: name, id }), { data, credentials }]))
    },
    update: function collectionUpdate(id, data) {
      return self.fql(q.Call(functions.defaults.Update.name, [q.Identity(), language.reference({ collection: name, id }), { data }]))
    },
    upsert: function collectionUpsert(id, data) {
      return self.fql(q.If(q.Exists(language.reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id })))
    },
    delete: function collectionDelete(id) {
      return self.fql(q.Update(language.reference({ collection: name, id }), {}))
    },
    forget: function collectionForget(id) {
      return self.fql(q.Delete(language.reference({ collection: name, id })))
    }
    // field() {},
    // index(opts) {}
  }
}

export const me: DBMe = {
  logout: function meLogout(everywhere) {
    return this.collection('users').logout(everywhere)
  },
  changePassword: function meChangePassword(password: string) {
    return this.collection('users').changePassword(password)
  },
  get: function meGet() {
    return this.collection('users').get(q.Select('id', q.Identity()))
  },
  update: function meUpdate(data) {
    return this.collection('users').update(q.Select('id', q.Identity()), data)
  },
  upsert: function meUpsert(data) {
    return this.collection('users').upsert(q.Select('id', q.Identity()), data)
  },
  delete: function meDelete() {
    return this.collection('users').delete(q.Select('id', q.Identity()))
  },
  forget: function meForget() {
    return this.collection('users').forget(q.Select('id', q.Identity()))
  }
}
