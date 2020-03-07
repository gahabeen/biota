import { query as q } from 'faunadb'
import { Rules, Rule, RuleBuilder } from './roles/helpers/rule'
import { TS_2500_YEARS } from './consts'

export const isFirstArgumentIdentity = Rule({
  name: 'isFirstArgumentIdentity',
  lambda: q.Lambda('args', q.Equals(q.Select(0, q.Var('args'), null), q.Identity()))
})

export const isDocumentAvailable = Rule({
  name: 'isDocumentAvailable',
  lambda: q.Lambda(
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
})

export const hasRoleBuilder = RuleBuilder({
  name: 'hasRole',
  lambda: (role) => q.Lambda('doc', q.Filter(q.Select(['private', 'roles'], q.Var('doc'), []), q.Lambda(['role'], q.Equals(q.Role(role), q.Var('role')))))
})

export const isOwner = Rule({
  name: 'isOwner'
})

export const isAssigned = Rule({
  name: 'isAssigned'
})

export const isSelf = Rule({
  name: 'isSelf'
})

export const isActivityNotChanged = Rule({
  name: 'isActivityNotChanged'
})

export const areRightsNotChanged = Rule({
  name: 'isActivityNotChanged'
})

export const verifySafeQuery = Rules([isActivityNotChanged, areRightsNotChanged])
