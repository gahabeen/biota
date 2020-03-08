import { isOwner, isNotOwner, isAssignee, isNotAssignee, all, none, isActivityNotChanged, areRightsNotChanged, isFirstArgumentIdentity } from './../../rule/defaults'
import { FaunaRuleLambda, FaunaRuleActionType } from './../../../types'

import { Rules } from '../../rule/methods/rule'

export function Action(type: FaunaRuleActionType): FaunaRuleLambda {
  switch (type) {
    case 'owner':
      return isOwner
    case 'not_owner':
      return isNotOwner
    case 'assignee':
      return isAssignee
    case 'not_assignee':
      return isNotAssignee
    case 'all':
      return all
    case 'none':
      return none
    default:
      return null
  }
}

export function CreateAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return Rules([type.map(Action), isActivityNotChanged, areRightsNotChanged])
}

export function DeleteAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return type.map(Action)
}

export function ReadAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return type.map(Action)
}

export function WriteAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return Rules([type.map(Action), isActivityNotChanged, areRightsNotChanged])
}

export function HistoryReadAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return type.map(Action)
}

export function HistoryWriteAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return Rules([type.map(Action), isActivityNotChanged, areRightsNotChanged])
}

export function UnrestrictedReadAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return type.map(Action)
}

export function CallAction(type: FaunaRuleActionType | FaunaRuleActionType[]): FaunaRuleLambda {
  if (!Array.isArray(type)) type = [type]
  return Rules([type.map(Action), isFirstArgumentIdentity, isActivityNotChanged, areRightsNotChanged])
}
