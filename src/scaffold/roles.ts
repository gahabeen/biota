import { query as q } from 'faunadb'
import * as functions from './functions'

import * as rules from './rules'
import { FaunaRole } from '~/types'

import { Role } from './roles/helpers/role'
import { Privilege } from './roles/helpers/privilege'
import { Rules } from './roles/helpers/rule'

export const AdminForUser = Role({
  name: 'AdminForUser'
})

export const Advanced = Role({
  name: 'Advanced',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rules.hasRoleBuilder('Advanced'))
  },
  privileges: [
    // Privilege({
    //   resource: q.Function(functions.MatchHidden.name),
    //   actions: { call: rules.isFirstArgumentIdentity }
    // })
  ]
})

console.log("functions.Match", functions);

export const User: FaunaRole = Role({
  name: 'User',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rules.hasRoleBuilder('User'))
  },
  privileges: [
    // collections
    Privilege({
      resource: q.Collection('users'),
      actions: {
        create: q.Query(rules.verifySafeQuery),
        delete: false,
        read: q.Query(rules.isDocumentAvailable),
        write: q.Query(rules.verifySafeQuery),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    }),
    // indexes

    // functions
    Privilege({ resource: q.Function(functions.Match.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Owner.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.ChangePassword.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Assign.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Import.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Create.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Update.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Replace.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Expire.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Delete.name), actions: { call: rules.isFirstArgumentIdentity } }),
    Privilege({ resource: q.Function(functions.Archive.name), actions: { call: rules.isFirstArgumentIdentity } })
  ]
})
