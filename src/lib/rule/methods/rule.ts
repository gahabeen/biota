import { FaunaRule, Fn, FaunaRuleLambda } from './../../../types'
import { query as q, Expr } from 'faunadb'

export const runLambda = (inputs, lambda) => q.Select(0, q.Map([...inputs], lambda))
export const everyLambda = (lambdas) => q.And(lambdas.map((lambda) => runLambda([q.Var('doc')], lambda)))

export function RuleBuilder(rule: FaunaRule) {
  return (...args: Expr[]) => ((rule || {}).lambda as Fn<Expr>)(...args)
}

export function Rule(rule: FaunaRule): FaunaRuleLambda {
  return (rule || {}).lambda
}

export function Rules(rules: FaunaRule[]) {
  return everyLambda(rules.map((rule) => (rule || {}).lambda))
}
