// types
import { FaunaRuleLambda, FaunaRuleAction, Fauna } from "~/../types/db";
// external
import * as fauna from "faunadb";
const q = fauna.query;
// biota
import { Rules } from "~/factory/api/rule";
import {
  is_self,
  is_owner,
  is_not_owner,
  is_assignee,
  is_not_assignee,
  all,
  none,
  // is_activity_not_changed,
  // are_rights_not_changed,
  is_first_argument_identity
} from "~/framework/api/default/rules";
import { wrapDoc } from "~/framework/helpers/wrapDoc";

export function Action(type: FaunaRuleAction): FaunaRuleLambda {
  switch (type) {
    case "self":
      return is_self;
    case "owner":
      return is_owner;
    case "not_owner":
      return is_not_owner;
    case "assignee":
      return is_assignee;
    case "not_assignee":
      return is_not_assignee;
    case "all":
      return all;
    case "none":
      return none;
    default:
      return false;
  }
}

function processActions(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[],
  defaultActions: FaunaRuleAction[] = []
) {
  if (!actions && defaultActions.length === 0) return false;
  if (!Array.isArray(actions)) {
    return [actions, ...defaultActions];
  } else {
    return [...actions, ...defaultActions];
  }
}

function prepareRules(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  return Rules(
    (actions as []).map(action => {
      if (typeof action === "string") {
        return Action(action as FaunaRuleAction);
      } else {
        return action;
      }
    })
  );
}

export function ReadAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions);
  if (typeof actions === "boolean") return actions;
  return q.Lambda("ref", wrapDoc("ref", prepareRules(actions)));
}

export function WriteAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
  ]);
  if (typeof actions === "boolean") return actions;
  return q.Lambda(["oldDoc", "newDoc"], prepareRules(actions));
}

export function CreateAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  if (actions) {
    actions = processActions(actions, [
      // is_activity_not_changed,
      // are_rights_not_changed
    ]);
    if (typeof actions === "boolean") return actions;
    return q.Lambda(["doc"], prepareRules(actions));
  }
  return false;
}

export function DeleteAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions);
  if (typeof actions === "boolean") return actions;
  return q.Lambda(
    ["ref"],
    q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions))
  );
}

export function HistoryReadAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions);
  if (typeof actions === "boolean") return actions;
  return q.Lambda(
    ["ref"],
    q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions))
  );
}

export function HistoryWriteAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
  ]);
  if (typeof actions === "boolean") return actions;
  return q.Lambda(["ref", "ts", "action", "doc"], prepareRules(actions));
}

export function UnrestrictedReadAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions);
  if (typeof actions === "boolean") return actions;
  return prepareRules(actions);
}

export function CallAction(
  actions: FaunaRuleAction | Fauna.Expr | FaunaRuleAction[] | Fauna.Expr[]
): FaunaRuleLambda {
  actions = processActions(actions, [
    // is_first_argument_identity
    // is_activity_not_changed,
    // are_rights_not_changed
  ]);
  if (typeof actions === "boolean") return actions;
  return q.Lambda("args", prepareRules(actions));
}
