import { query as q, Expr } from 'faunadb';

export function CanConvertToString(value: Expr) {
  return q.Let(
    {
      isString: q.IsString(value),
      isNumber: q.IsNumber(value),
      isBoolean: q.IsBoolean(value),
      isNull: q.IsNull(value),
      isTime: q.IsTimestamp(value),
      isDate: q.IsDate(value),
    },
    q.Or(q.Var('isString'), q.Var('isNull'), q.Var('isNumber'), q.Var('isBoolean'), q.Var('isTime'), q.Var('isDate')),
  );
}
