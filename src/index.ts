import { query as q, Expr } from 'faunadb'
import * as fauna from './fauna'
import * as m from './methods'

import * as functions from './scaffold/functions'

import { DB, DBCollection, DBFqlWrapper } from './types'

export function DB({ secret }): DB {
  const client = fauna.client(secret)

  let db: DB = {
    q,
    client,
    query: (fqlQuery: Expr) => {
      const resolver = (fql: Expr) =>
        Object.entries(fql).reduce((resolved, [key, value]) => {
          if (Array.isArray(value)) {
            resolved[key] = value.map(resolver)
          } else if (typeof value === 'object') {
            if (value[Symbol('FQLWrapper')]) {
              resolved[key] = value.fql as Expr
            } else {
              resolved[key] = resolver(value)
            }
          }
          return resolved
        }, fql)
      return client.query.call(client, resolver(fqlQuery))
    },
    fql: (fqlQuery: Expr): DBFqlWrapper => ({
      [Symbol('FQLWrapper')]: true,
      fql: fqlQuery,
      query: function() {
        return client.query(this.fql)
      }
    })
  }

  const scaffold = () => {}

  const get = {
    collections() {
      return db.fql(q.Paginate(q.Collections(), {}))
    },
    indexes() {
      return db.fql(q.Paginate(q.Indexes(), {}))
    },
    functions() {
      return db.fql(q.Paginate(q.Functions(), {}))
    },
    roles() {
      return db.fql(q.Paginate(q.Roles(), {}))
    },
    keys() {
      return db.fql(q.Paginate(q.Keys()))
    }
  }

  const create = {
    collection(name: string, opts) {
      return db.fql(
        q.CreateCollection({
          name
        })
      )
    },
    index(name: string, opts) {
      return db.fql(
        q.CreateIndex({
          name
        })
      )
    },
    function(name: string, opts) {
      return db.fql(
        q.CreateFunction({
          name
        })
      )
    },
    role(name: string, opts) {
      return db.fql(
        q.CreateRole({
          name
        })
      )
    }
  }

  const update = {
    collection(name: string, opts) {
      return db.fql(q.Update(q.Collection(name), {}))
    },
    index(name: string, opts) {
      return db.fql(q.Update(q.Index(name), {}))
    },
    function(name: string, opts) {
      return db.fql(q.Update(q.Function(name), {}))
    },
    role(name: string, opts) {
      return db.fql(q.Update(q.Role(name), {}))
    }
  }

  const upsert = {
    collection(name: string) {
      return db.fql(q.If(q.Exists(q.Collection(name)), update.collection(name, {}), create.collection(name, {})))
    },
    index(name: string) {
      return db.fql(q.If(q.Exists(q.Index(name)), update.index(name, {}), create.index(name, {})))
    },
    function(name: string) {
      return db.fql(q.If(q.Exists(q.Function(name)), update.function(name, {}), create.function(name, {})))
    },
    role(name: string) {
      return db.fql(q.If(q.Exists(q.Role(name)), update.role(name, {}), create.role(name, {})))
    }
  }

  const replace = {
    collection(name: string, opts) {
      return db.fql(q.Replace(q.Collection(name), {}))
    },
    index(name: string, opts) {
      return db.fql(q.Replace(q.Index(name), {}))
    },
    function(name: string, opts) {
      return db.fql(q.Replace(q.Function(name), {}))
    },
    role(name: string, opts) {
      return db.fql(q.Replace(q.Role(name), {}))
    }
  }

  const forget = {
    collection(name: string) {
      return db.fql(q.Delete(q.Collection(name)))
    },
    index(name: string) {
      return db.fql(q.Delete(q.Index(name)))
    },
    function(name: string) {
      return db.fql(q.Delete(q.Function(name)))
    },
    role(name: string) {
      return db.fql(q.Delete(q.Role(name)))
    }
  }

  const collection = (name: string): DBCollection => {
    return {
      login(password) {
        return db.fql(q.Login(q.Identity(), { password }))
      },
      logout(everywhere) {
        return db.fql(q.Logout(everywhere))
      },
      changePassword(password: string) {
        return db.fql(q.Call(functions.ChangePassword.name, [q.Identity(), q.Identity(), password]))
      },
      get(id: string | object) {
        return db.fql(q.Get(q.Ref(q.Collection(collection), id)))
      },
      create(data, { id, credentials }) {
        return db.fql(q.Call(functions.Create.name, [q.Identity(), m.reference({ collection: name, id }), { data, credentials }]))
      },
      update(id, data) {
        return db.fql(q.Call(functions.Update.name, [q.Identity(), m.reference({ collection: name, id }), { data }]))
      },
      upsert(id, data) {
        return db.fql(q.If(q.Exists(m.reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id })))
      },
      delete(id) {
        return db.fql(q.Update(m.reference({ collection: name, id }), {}))
      },
      forget(id) {
        return db.fql(q.Delete(m.reference({ collection: name, id })))
      },
      batch: {
        // async get() {},
        // async create() {},
        // async update() {},
        // async upsert() {},
        // async delete() {},
        // async forget() {}
      }
      // field() {},
      // index(opts) {}
    }
  }

  return {
    ...db,
    scaffold,
    ...get,
    create,
    update,
    upsert,
    replace,
    forget,
    collection
  }
}

// const db = DB({ secret: '123' })

// // init
// db.scaffold()

// // create collection
// // db.create.function('users', {})
// // db.create.index('users', {})
// // db.create.role('users', {})
// // db.create.database('users')
// db.create.collection('users')

// // db.udpate
// // db.delete

// // unique field
// db.collection('users').field({
//   field: 'data.profile.email',
//   unique: true
// })

// // 1-to-1 relationship (one user can have one company and inverse)
// db.collection('users').field({
//   field: 'data.company',
//   relation: db.collection('companies').field({ field: 'ref', one: true }),
//   one: true
// })

// // 1-to-many relationship (one company can have several users and inverse)
// db.collection('users').field({
//   field: 'data.company',
//   relation: db.collection('companies').field({ field: 'ref', one: true }),
//   many: true
// })

// // create
// db.collection('users').create({
//   profile: {
//     email: 'desserprit.gabin@gmail.com'
//   },
//   // company: db.collection("companies").connect(1234)
//   company: db.collection('companies').create({
//     name: 'Super ça'
//   })
// })

// db.collection('users').index({ 'term:data.profile.email': '' })
// db.collection('users').get(123)
// db.collection('users').get({ 'term:data.profile.email': '', size: 3, after: 'cursor' })
