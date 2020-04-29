import { query as q, Expr } from 'faunadb';
import { StringSplit } from './StringSplit';
import { FaunaString } from '~/types/fauna';

export function ContainsAnyPath(paths: FaunaString, value: Expr) {
  return q.Any(q.Map(paths, q.Lambda(['path'], q.Contains(StringSplit(q.Var('path')), value))));
}
