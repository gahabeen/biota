// types
import { FaunaRule, Fn, FaunaRuleLambda, Fauna } from "~/../types/db";
// External
import { query as q } from "faunadb";

export function RuleBuilder(rule: FaunaRule) {
  return (...args: Fauna.Expr[]) =>
    ((rule || {}).query as Fn<Fauna.Expr>)(...args);
}

export function Rule(rule: FaunaRule): FaunaRuleLambda {
  return (rule || {}).query;
  // return (rule || {}).lambda
}

export function Rules(rules: FaunaRule[]) {
  if (rules.length > 1) {
    return q.And(...rules);
  } else {
    return rules[0];
  }
}
