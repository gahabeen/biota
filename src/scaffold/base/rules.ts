import { query as q } from 'faunadb'
import { Rules, Rule, RuleBuilder } from '../../rule'
import { TS_2500_YEARS } from '../../consts'

export const is_first_argument_identity = Rule({
  name: 'is_first_argument_identity',
  query: q.Lambda('args', q.Equals(q.Select(0, q.Var('args'), null), q.Identity()))
})

export const is_document_available = Rule({
  name: 'is_document_available',
  query: q.Let(
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
})

export const has_role = RuleBuilder({
  name: 'has_role',
  query: (role) => q.Filter(q.Select(['roles'], q.Var('doc'), []), q.Lambda(['role'], q.Equals(q.Role(role), q.Var('role'))))
})

export const is_owner = Rule({
  name: 'is_owner',
  query: q.Equals(q.Select(['activity', 'owner'], q.Var('doc'), null), q.Identity())
})

export const is_not_owner = Rule({
  name: 'is_not_owner',
  query: q.Not(q.Equals(q.Select(['activity', 'owner'], q.Var('doc'), null), q.Identity()))
})

export const is_assignee = Rule({
  name: 'is_assignee',
  query: q.Equals(q.Select(['activity', 'assignees'], q.Var('doc'), null), q.Identity())
})

export const is_not_assignee = Rule({
  name: 'is_not_assignee',
  query: q.Not(q.Equals(q.Select(['activity', 'assignees'], q.Var('doc'), null), q.Identity()))
})

export const all = Rule({
  name: 'all',
  query: true
})

export const none = Rule({
  name: 'none',
  query: false
})

export const is_self = Rule({
  name: 'is_self'
})

export const is_activity_not_changed = Rule({
  name: 'is_activity_not_changed'
  // query: q.Lambda("ref")
})

export const are_rights_not_changed = Rule({
  name: 'are_rights_not_changed'
})

export const very_safe_query = Rules([is_activity_not_changed, are_rights_not_changed])
