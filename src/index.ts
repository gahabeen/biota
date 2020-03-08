import { DBFqlWrapper, DBQueryOptions, PromiseFn, DBFqlWrapperOptions, DBCollection, Fn, DBCreate, DBReplace, DBUpdate, DBUpsert, DBForget, DBMe, DBScaffold } from './types'
import * as fauna from 'faunadb'
import { query as q, Expr } from 'faunadb'

import { scaffold, collection, get, create, update, upsert, replace, forget, me } from './lib/api/index'

export class DB {
  constructor({ secret }) {
    // console.log('set up with secret', secret)
    this.client = new fauna.Client({ secret })

    this.query = async function query(fqlQuery?: Expr) {
      // console.log('query')
      const resolver = (fql: Expr) =>
        Object.entries(fql).reduce((resolved, [key, value]) => {
          if (value) {
            if (Array.isArray(value)) {
              resolved[key] = value.map(resolver)
            } else if (typeof value === 'object') {
              let symbols = Object.getOwnPropertySymbols(value).map((a) => a.toString())
              let hasFQLWrapper = symbols.includes('Symbol(FQLWrapper)')
              let hasDBCollection = symbols.includes('Symbol(DBCollection)')
              if (hasFQLWrapper) {
                resolved[key] = value.fql as Expr
              } else if (hasDBCollection) {
                try {
                  resolved[key] = value.list().fql
                } catch (error) {
                  console.error(error)
                }
              } else {
                resolved[key] = resolver(value)
              }
            } else {
              resolved[key] = value
            }
          } else {
            resolved[key] = value
          }
          return resolved
        }, {})
      let resolvedQuery = resolver(fqlQuery)
      return this.client.query(resolvedQuery)
    }

    this.fql = function fql(fqlQuery: Expr, options?: DBFqlWrapperOptions): DBFqlWrapper {
      const { then = (res: any) => res } = options || {}
      const self = this
      return {
        [Symbol('FQLWrapper')]: true,
        then,
        fql: fqlQuery,
        query: function() {
          return self.client.query(fqlQuery) //.then(then)
        }
      }
    }

    this.login = async function login(id: fauna.Expr, password: string): Promise<DB> {
      try {
        const loggedin = await this.collection('users')
          .login(password, id)
          .query()
        return new DB({ secret: loggedin.secret })
      } catch (e) {
        console.error(e)
      }
    }

    function bindThis(self, rootKey) {
      const resolver = (value) => {
        let entries = Object.entries(value)
        for (let [key, entry] of entries) {
          if (typeof entry === 'object') {
            value[key] = resolver(entry)
          } else if (typeof entry === 'function') {
            value[key] = entry.bind(self)
          } else {
            value[key] = entry
          }
        }
      }
      resolver(self[rootKey] || {})
    }

    this.collection = collection.bind(this)
    this.scaffold = scaffold
    bindThis(this, 'scaffold')
    this.create = create
    bindThis(this, 'create')
    this.update = update
    bindThis(this, 'update')
    this.upsert = upsert
    bindThis(this, 'upsert')
    this.replace = replace
    bindThis(this, 'replace')
    this.forget = forget
    bindThis(this, 'forget')
    this.me = me
    bindThis(this, 'me')
    // this.create = {
    //   collection: create.collection.bind(this),
    //   index: create.index.bind(this),
    //   function: create.function.bind(this),
    //   role: create.role.bind(this)
    // }
    // this.update = {
    //   collection: update.collection.bind(this),
    //   index: update.index.bind(this),
    //   function: update.function.bind(this),
    //   role: update.role.bind(this)
    // }
    // this.upsert = {
    //   collection: upsert.collection.bind(this),
    //   index: upsert.index.bind(this),
    //   function: upsert.function.bind(this),
    //   role: upsert.role.bind(this)
    // }
    // this.replace = {
    //   collection: replace.collection.bind(this),
    //   index: replace.index.bind(this),
    //   function: replace.function.bind(this),
    //   role: replace.role.bind(this)
    // }
    // this.forget = {
    //   collection: forget.collection.bind(this),
    //   index: forget.index.bind(this),
    //   function: forget.function.bind(this),
    //   role: forget.role.bind(this)
    // }
    // this.me = {
    //   logout: me.logout.bind(this),
    //   changePassword: me.changePassword.bind(this),
    //   get: me.get.bind(this),
    //   update: me.update.bind(this),
    //   upsert: me.upsert.bind(this),
    //   delete: me.delete.bind(this),
    //   forget: me.forget.bind(this)
    // }

    this.collections = get.collections.bind(this)
    this.indexes = get.indexes.bind(this)
    this.functions = get.functions.bind(this)
    this.roles = get.roles.bind(this)
    this.keys = get.keys.bind(this)
    this.credentials = get.credentials.bind(this)
  }

  q: any = q
  client: fauna.Client

  query
  fql
  login

  collection: Fn<DBCollection>

  scaffold: DBScaffold
  create: DBCreate
  update: DBUpdate
  upsert: DBUpsert
  replace: DBReplace
  forget: DBForget
  me: DBMe

  collections: Fn<DBFqlWrapper>
  indexes: Fn<DBFqlWrapper>
  functions: Fn<DBFqlWrapper>
  roles: Fn<DBFqlWrapper>
  keys: Fn<DBFqlWrapper>
  credentials: Fn<DBFqlWrapper>
}
