import { query as q } from 'faunadb'
import * as functions from './functions'

export const RUN_LAMBDA = (inputs, lambda) => q.Select(0, q.Map([...inputs], lambda))
export const EVERY_LAMBDA = (lambdas) => q.And(lambdas.map((lambda) => RUN_LAMBDA([q.Var('doc')], lambda))))

export const TS_2500_YEARS = 31556952 * 1000 * 530
export const IS_FIRST_ARG_USER = q.Lambda('args', q.Equals(q.Select(0, q.Var('args'), null), q.Identity()))
export const IS_DOCUMENT_LIVE = q.Lambda(
  'doc',
  q.Let(
    {
      deleted_at: q.Select(['data', 'activity', 'deleted_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS)),
      archived_at: q.Select(['data', 'activity', 'archived_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS)),
      expired_at: q.Select(['data', 'activity', 'expired_at'], q.Var('doc'), q.ToTime(TS_2500_YEARS))
    },
    q.If(
      q.LTE(q.Var('deleted_at'), q.Var('archived_at'), q.Var('expired_at')),
      q.Var('deleted_at'),
      q.If(q.LTE(q.Var('archived_at'), q.Var('expired_at'), q.Var('deleted_at')), q.Var('archived_at'), q.Var('expired_at'))
    )
  )
)
export const IS_OWNER = ""
export const IS_ASSIGNED = ""
export const IS_SELF = ""
export const IS_ACTIVITY_NOT_CHANGED = ''
export const IS_PRIVATE_NOT_CHANGED = ''
export const HAS_ROLE = (role) => q.Lambda('doc', q.Filter(q.Select(['private', 'roles'], q.Var('doc'), []), q.Lambda(['role'], q.Equals(q.Role(role), q.Var('role')))))

export const VERIFY_SAFE_QUERY = EVERY_LAMBDA([IS_ACTIVITY_NOT_CHANGED, IS_PRIVATE_NOT_CHANGED])

export const AdminForUser = {
  name: 'AdminForUser',
  membership: {},
  privileges: [],
  data: {}
}

export const Advanced = {
  name: 'Advanced',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(HAS_ROLE('Advanced'))
  },
  privileges: [
    // functions
    { resource: q.Function(functions.FunctionMatchHidden.name), actions: { call: IS_FIRST_ARG_USER } }
  ]
}

export const User = {
  name: 'User',
  membership: {
    resource: q.Collection('users'),
    predicate: q.Query(HAS_ROLE('User'))
  },
  privileges: [
    // collections
    {
      resource: q.Collection('users'),
      actions: {
        create: q.Query(VERIFY_SAFE_QUERY),
        delete: false,
        read: q.Query(IS_DOCUMENT_LIVE),
        write: q.Query(VERIFY_SAFE_QUERY),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    },
    // indexes

    // functions
    { resource: q.Function(functions.FunctionMatch.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionOwner.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionChangePassword.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionAssign.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionImport.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionCreate.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionUpdate.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionReplace.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionExpire.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionDelete.name), actions: { call: IS_FIRST_ARG_USER } },
    { resource: q.Function(functions.FunctionArchive.name), actions: { call: IS_FIRST_ARG_USER } }
  ]
}
