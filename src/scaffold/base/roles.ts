// types
import { FaunaRole } from '~/types'
// imports
import { query as q } from 'faunadb'
// lib
// import * as fn from '~/lib/function'
// import * as rule from '~/lib/rule'
import { Role, Action, Privilege, CustomPrivilege } from '~/lib/role'
// local
import * as rule from './rules'

export const AdminForUser = Role({
  name: 'AdminForUser'
})

export const Advanced = Role({
  name: 'Advanced',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rule.has_role('Advanced'))
  },
  privileges: [
    // Privilege({
    //   resource: q.Function(fn.MatchHidden.name),
    //   actions: { call:"all" }
    // })
  ]
})

export const User: FaunaRole = Role({
  name: 'User',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(rule.has_role('User'))
  },
  privileges: [
    // collections
    CustomPrivilege({
      resource: q.Collection('users'),
      actions: {
        create: q.Query(rule.very_safe_query),
        delete: false,
        read: q.Query(rule.is_document_available),
        write: q.Query(rule.very_safe_query),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    }),
    // indexes

    // functions
    Privilege({ resource: q.Function('Match'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Owner'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('ChangePassword'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Assign'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Import'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Create'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Update'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Replace'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Expire'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Delete'), actions: { call: 'all' } }),
    Privilege({ resource: q.Function('Archive'), actions: { call: 'all' } })
  ]
})
