import { query as q, Expr } from 'faunadb';
import { FALSE_EXPR } from '~/consts';

export function IsFalse(value: Expr) {
  return q.Equals(value, FALSE_EXPR);
}
