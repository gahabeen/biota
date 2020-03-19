// types
import { Fauna, DBCollection, Fn, DBCreate, DBReplace, DBUpdate, DBUpsert, DBForget, DBMe, DBScaffold, DBQL } from './types'
// external
import delay from 'delay'
import * as fauna from 'faunadb'
import { query as q, Expr } from 'faunadb'
// biota
import * as ql from './lib/ql'
import * as api from './lib/api'
import { logger, printer, execute, steps } from '~/logger'

export class DB {
  constructor({ secret }) {
    this.client = new fauna.Client({ secret })
    this.print = printer
    this.log = logger
    this.execute = execute
    this.steps = steps
    this.delay = delay

    this.query = async function query(fqlQuery?: Expr | Fauna.Expr, description: string = '') {
      return this.client.query(fqlQuery)
    }

    this.login = async function login(id: Fauna.Expr, password: string): Promise<DB> {
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
        return value
      }
      resolver(self[rootKey] || {})
    }

    this.collection = api.collection.bind(this)
    this.scaffold = api.scaffold
    bindThis(this, 'scaffold')
    this.create = api.create
    bindThis(this, 'create')
    this.update = api.update
    bindThis(this, 'update')
    this.upsert = api.upsert
    bindThis(this, 'upsert')
    this.replace = api.replace
    bindThis(this, 'replace')
    this.forget = api.forget
    bindThis(this, 'forget')
    this.me = api.me
    bindThis(this, 'me')

    this.get = api.get.get.bind(this)
    this.collections = api.get.collections.bind(this)
    this.indexes = api.get.indexes.bind(this)
    this.functions = api.get.functions.bind(this)
    this.roles = api.get.roles.bind(this)
    this.keys = api.get.keys.bind(this)
    this.tokens = api.get.tokens.bind(this)
    this.credentials = api.get.credentials.bind(this)
  }

  q: any = q
  ql: DBQL = ql
  client: fauna.Client

  // methods
  delay
  steps
  execute
  print
  log
  query
  wrap
  login

  collection: Fn<DBCollection>

  scaffold: DBScaffold
  create: DBCreate
  update: DBUpdate
  upsert: DBUpsert
  replace: DBReplace
  forget: DBForget
  me: DBMe

  get: Fn<Fauna.Expr>
  collections: Fn<Fauna.Expr>
  indexes: Fn<Fauna.Expr>
  functions: Fn<Fauna.Expr>
  roles: Fn<Fauna.Expr>
  keys: Fn<Fauna.Expr>
  tokens: Fn<Fauna.Expr>
  credentials: Fn<Fauna.Expr>
}
