import { query as q, Expr } from 'faunadb';

export function ComposeIfTrue(...steps: Expr[]) {
  return q.Let([{ step: true }, ...steps.map((step) => ({ step: q.If(q.Var('step'), step, q.Var('step')) }))], q.Var('step'));
}
