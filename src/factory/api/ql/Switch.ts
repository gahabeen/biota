import { query as q, Expr } from 'faunadb';

export function Switch(value: Expr, cases: Expr, defaultValue: Expr = undefined) {
  const SWITCH_DEFAULT = '$$SWITCH_DEFAULT';
  return q.Let(
    {
      result: q.Reduce(
        q.Lambda(
          ['switch', 'caseAction'],
          q.If(q.Equals(value, q.Select(0, q.Var('caseAction'))), q.Select(1, q.Var('caseAction')), q.Var('switch')),
        ),
        SWITCH_DEFAULT,
        q.ToArray(cases),
      ),
    },
    q.If(q.Equals(q.Var('result'), SWITCH_DEFAULT), defaultValue, q.Var('result')),
  );
}
