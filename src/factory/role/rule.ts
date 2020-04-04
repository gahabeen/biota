import { query as q } from "faunadb";
import { Fn } from "~/../types/db";
import { Fauna, FaunaRule, FaunaRuleLambda } from "~/../types/fauna";

export function RuleBuilder(rule: FaunaRule) {
  return (...args: Fauna.Expr[]) => ((rule || {}).query as Fn<Fauna.Expr>)(...args);
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
