import { Expr, query as q } from 'faunadb';
import { PATTERNS } from '~/consts';

export function ConvertToNumber(value: Expr) {
  return q.Let(
    [
      {
        value,
      },
      {
        converted: null,
      },
      {
        converted: q.If(
          q.And(q.IsString(value), q.IsNonEmpty(q.FindStrRegex(q.Var('value'), PATTERNS.SOME_NUM.toString().slice(1, -1)))),
          q.ToNumber(q.Var('value')),
          q.Var('converted'),
        ),
      },
      {
        converted: q.If(q.IsNumber(q.Var('value')), q.Var('value'), q.Var('converted')),
      },
    ],
    q.Var('converted'),
  );
}
