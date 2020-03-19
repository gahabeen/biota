// types
import { FaunaRuleLambda, FaunaRuleActionType } from '~/types'
// external
import * as fauna from 'faunadb'
const q = fauna.query
// biota
import { Rules } from '~/lib/rule'
import { is_owner, is_not_owner, is_assignee, is_not_assignee, all, none, is_activity_not_changed, are_rights_not_changed, is_first_argument_identity } from '~/lib/domains/base/rules'

export function Action(type: FaunaRuleActionType): FaunaRuleLambda {
  switch (type) {
    case 'owner':
      return is_owner
    case 'not_owner':
      return is_not_owner
    case 'assignee':
      return is_assignee
    case 'not_assignee':
      return is_not_assignee
    case 'all':
      return all
    case 'none':
      return none
    default:
      return false
  }
}

function processActions(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  return Rules(
    (actions as []).map((action) => {
      if (typeof action === 'string') {
        return Action(action as FaunaRuleActionType)
      } else {
        return action
      }
    })
  )
}

export function ReadAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)))
}

export function WriteAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  actions = [...(actions as []), is_activity_not_changed, are_rights_not_changed]
  return q.Lambda(['oldDoc', 'newDoc'], processActions(actions))
}

export function CreateAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  actions = [...(actions as []), is_activity_not_changed, are_rights_not_changed]
  return q.Lambda(['doc'], processActions(actions))
}

export function DeleteAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)))
}

export function HistoryReadAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)))
}

export function HistoryWriteAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  actions = [...(actions as []), is_activity_not_changed, are_rights_not_changed]
  return q.Lambda(['ref', 'ts', 'action', 'doc'], processActions(actions))
}

export function UnrestrictedReadAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  return false // UPDATE!
}

export function CallAction(actions: FaunaRuleActionType | Fauna.Expr | FaunaRuleActionType[] | Fauna.Expr[]): FaunaRuleLambda {
  if (!Array.isArray(actions)) actions = [actions]
  actions = [...(actions as []), is_first_argument_identity, is_activity_not_changed, are_rights_not_changed]
  return q.Lambda(['args'], processActions(actions))
}
