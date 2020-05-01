import { query as q, Expr } from 'faunadb';

export const Slice = (array: Expr, start: Expr, end = null) =>
  q.Let(
    {
      endCalc: q.Subtract(q.Add(1, q.If(q.IsNull(end), q.Count(array), end)), start),
    },
    q.Take(q.Var('endCalc'), q.Drop(start, array)),
  );
