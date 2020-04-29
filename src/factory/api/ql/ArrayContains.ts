import { query as q, Expr } from 'faunadb';

export function ArrayContains(arr: Expr, item: Expr) {
  return q.GT(q.Count(q.Filter(arr, q.Lambda('item', q.Equals(q.Var('item'), item)))), 0);
}
