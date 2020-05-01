import { Expr, query as q } from 'faunadb';

export function IsTrue(value: Expr) {
  return q.Equals(value, true);
}
