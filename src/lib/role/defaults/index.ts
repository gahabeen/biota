import { FaunaRole } from './../../../types'

import { query as q } from 'faunadb'
import * as functions from './../../function'
import * as rules from './../../rule'
import { Role, Action, Privilege, CustomPrivilege } from './../../role'
const { Rules } = rules

export const AdminForUser = Role({
  name: 'AdminForUser'
})

export const Advanced = Role({
  name: 'Advanced',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rules.defaults.hasRole('Advanced'))
  },
  privileges: [
    // Privilege({
    //   resource: q.Function(functions.MatchHidden.name),
    //   actions: { call:"all" }
    // })
  ]
})

export const User: FaunaRole = Role({
  name: 'User',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rules.defaults.hasRole('User'))
  },
  privileges: [
    // collections
    CustomPrivilege({
      resource: q.Collection('users'),
      actions: {
        create: q.Query(rules.defaults.verifySafeQuery),
        delete: false,
        read: q.Query(rules.defaults.isDocumentAvailable),
        write: q.Query(rules.defaults.verifySafeQuery),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    }),
    // indexes

    // functions
    Privilege({ resource: q.Function(functions.defaults.Match.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Owner.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.ChangePassword.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Assign.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Import.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Create.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Update.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Replace.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Expire.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Delete.name), actions: { call: 'all' } }),
    Privilege({ resource: q.Function(functions.defaults.Archive.name), actions: { call: 'all' } })
  ]
})
