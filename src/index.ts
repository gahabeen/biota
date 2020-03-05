import { query as q } from 'faunadb'
import * as fauna from './fauna'
import * as m from './methods'

import * as functions from './scaffold/functions'

import { DB, DBCollection } from './types'

export function DB({ secret }): DB {
  const client = fauna.client(secret)

  let db: DB = {
    q,
    client,
    query: client.query.bind(client)
  }

  const scaffold = async () => {}

  const get = {
    async collections() {
      return db.query(q.Paginate(q.Collections(), {}))
    },
    async indexes() {
      return db.query(q.Paginate(q.Indexes(), {}))
    },
    async functions() {
      return db.query(q.Paginate(q.Functions(), {}))
    },
    async roles() {
      return db.query(q.Paginate(q.Roles(), {}))
    },
    async keys() {
      return db.query(q.Paginate(q.Keys()))
    }
  }

  const create = {
    collection(name: string, opts) {
      return db.query(q.CreateCollection({}))
    },
    index(name: string, opts) {
      return db.query(q.CreateIndex({}))
    },
    function(name: string, opts) {
      return db.query(q.CreateFunction({}))
    },
    role(name: string, opts) {
      return db.query(q.CreateRole({}))
    }
  }

  const update = {
    collection(name: string, opts) {
      return db.query(q.Update(q.Collection(name), {}))
    },
    index(name: string, opts) {
      return db.query(q.Update(q.Index(name), {}))
    },
    function(name: string, opts) {
      return db.query(q.Update(q.Function(name), {}))
    },
    role(name: string, opts) {
      return db.query(q.Update(q.Role(name), {}))
    }
  }

  const upsert = {
    collection(name: string) {
      return db.query(q.If(q.Exists(q.Collection(name)), update.collection(name, {}), create.collection(name, {})))
    },
    index(name: string) {
      return db.query(q.If(q.Exists(q.Index(name)), update.index(name, {}), create.index(name, {})))
    },
    function(name: string) {
      return db.query(q.If(q.Exists(q.Function(name)), update.function(name, {}), create.function(name, {})))
    },
    role(name: string) {
      return db.query(q.If(q.Exists(q.Role(name)), update.role(name, {}), create.role(name, {})))
    }
  }

  const replace = {
    collection(name: string, opts) {
      return db.query(q.Replace(q.Collection(name), {}))
    },
    index(name: string, opts) {
      return db.query(q.Replace(q.Index(name), {}))
    },
    function(name: string, opts) {
      return db.query(q.Replace(q.Function(name), {}))
    },
    role(name: string, opts) {
      return db.query(q.Replace(q.Role(name), {}))
    }
  }

  const forget = {
    collection(name: string) {
      return db.query(q.Delete(q.Collection(name), {}))
    },
    index(name: string) {
      return db.query(q.Delete(q.Index(name), {}))
    },
    function(name: string) {
      return db.query(q.Delete(q.Function(name), {}))
    },
    role(name: string) {
      return db.query(q.Delete(q.Role(name), {}))
    }
  }

  const collection = (name: string): DBCollection => {
    return {
      async login(password) {
        return db.query(q.Login(q.Identity(), { password }))
      },
      async logout(everywhere) {
        return db.query(q.Logout(everywhere))
      },
      async changePassword(password: string) {
        return db.query(q.Call(functions.FunctionChangePassword.name, [q.Identity(), q.Identity(), password]))
      },
      async get(id: string | object) {
        return db.query(q.Get(q.Ref(q.Collection(collection), id)))
      },
      async create(data, { id, credentials }) {
        return db.query(q.Call(functions.FunctionCreate.name, [q.Identity(), m.reference({ collection: name, id }), { data, credentials }]))
      },
      async update(id, data) {
        return db.query(q.Call(functions.FunctionUpdate.name, [q.Identity(), m.reference({ collection: name, id }), { data }]))
      },
      async upsert(id, data) {
        return db.query(q.If(q.Exists(m.reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id })))
      },
      async delete(id) {
        return db.query(q.Update(m.reference({ collection: name, id }), {}))
      },
      async forget() {},
      batch: {
        async get() {},
        async create() {},
        async update() {},
        async upsert() {},
        async delete() {},
        async forget() {}
      },
      field() {},
      index(opts) {}
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

const db = DB({ secret: '123' })

// init
db.scaffold()

// create collection
// db.create.function('users', {})
// db.create.index('users', {})
// db.create.role('users', {})
// db.create.database('users')
db.create.collection('users')

// db.udpate
// db.delete

// unique field
db.collection('users').field({
  field: 'data.profile.email',
  unique: true
})

// 1-to-1 relationship (one user can have one company and inverse)
db.collection('users').field({
  field: 'data.company',
  relation: db.collection('companies').field({ field: 'ref', one: true }),
  one: true
})

// 1-to-many relationship (one company can have several users and inverse)
db.collection('users').field({
  field: 'data.company',
  relation: db.collection('companies').field({ field: 'ref', one: true }),
  many: true
})

// create
db.collection('users').create({
  profile: {
    email: 'desserprit.gabin@gmail.com'
  },
  // company: db.collection("companies").connect(1234)
  company: db.collection('companies').create({
    name: 'Super ça'
  })
})

db.collection('users').index({ 'term:data.profile.email': '' })
db.collection('users').get(123)
db.collection('users').get({ 'term:data.profile.email': '', size: 3, after: 'cursor' })
