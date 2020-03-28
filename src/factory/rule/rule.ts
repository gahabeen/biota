// types
import { FaunaRule, Fn, FaunaRuleLambda, Fauna } from "~/../types/db";
// External
import { query as q } from "faunadb";

export const runLambda = (inputs, lambda) =>
  q.Select(0, q.Map([...inputs], lambda));
export const everyLambda = lambdas =>
  q.And(lambdas.map(lambda => runLambda([q.Var("doc")], lambda)));

export function RuleBuilder(rule: FaunaRule) {
  return (...args: Fauna.Expr[]) =>
    ((rule || {}).query as Fn<Fauna.Expr>)(...args);
  // return (...args: Expr[]) => ((rule || {}).lambda as Fn<Expr>)(...args)
}

export function Rule(rule: FaunaRule): FaunaRuleLambda {
  return (rule || {}).query;
  // return (rule || {}).lambda
}

export function Rules(rules: FaunaRule[]) {
  // return rules //.map((rule) => (rule || {}).query)
  // return everyLambda(rules.map((rule) => (rule || {}).lambda))
  if (rules.length > 1) {
    return q.And(...rules);
  } else {
    return rules[0];
  }
}
