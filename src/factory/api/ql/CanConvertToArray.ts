import { query as q, Expr } from 'faunadb';

export function CanConvertToArray(value: Expr) {
  return q.Let(
    {
      isString: q.IsString(value), // by splitting on semi-comas ;
      isObject: q.IsObject(value),
    },
    q.Or(q.Var('isString'), q.Var('isObject')),
  );
}
