import { query as q, Expr } from 'faunadb';
import { ArrayContains } from './ArrayContains';

export function ConvertToBoolean(value: Expr) {
  return q.Let(
    [
      {
        value,
      },
      {
        converted: null,
      },
      {
        converted: q.If(q.And(q.IsString(q.Var('value')), ArrayContains(['1', 'on', 'true'], q.Var('value'))), true, q.Var('converted')),
      },
      {
        converted: q.If(q.And(q.IsString(q.Var('value')), ArrayContains(['0', 'off', 'false'], q.Var('value'))), false, q.Var('converted')),
      },
      {
        converted: q.If(q.And(q.IsNumber(q.Var('value')), q.Equals(1, q.Var('value'))), true, q.Var('converted')),
      },
      {
        converted: q.If(q.And(q.IsNumber(q.Var('value')), q.Equals(0, q.Var('value'))), false, q.Var('converted')),
      },
    ],
    q.Var('converted'),
  );
}
