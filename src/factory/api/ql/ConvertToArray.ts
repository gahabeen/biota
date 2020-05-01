import { Expr, query as q } from 'faunadb';
import { StringSplit } from './StringSplit';

export function ConvertToArray(value: Expr) {
  return q.Let(
    [
      {
        value,
      },
      {
        converted: null,
      },
      {
        converted: q.If(q.IsString(q.Var('value')), StringSplit(q.Var('value'), ';'), q.Var('converted')),
      },
      {
        converted: q.If(q.IsObject(q.Var('value')), q.ToArray(q.Var('value')), q.Var('converted')),
      },
    ],
    q.Var('converted'),
  );
}
