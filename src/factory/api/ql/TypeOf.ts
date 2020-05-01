import { query as q, Expr } from 'faunadb';
import { Types } from '~/consts';

export function TypeOf(value: Expr) {
  return q.Let(
    {
      value,
      type: q.Let(
        [
          { t: null },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsArray(q.Var('value')), Types.array, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsBoolean(q.Var('value')), Types.boolean, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsBytes(q.Var('value')), Types.bytes, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsCollection(q.Var('value')), Types.collection, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsCredentials(q.Var('value')), Types.credentials, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDatabase(q.Var('value')), Types.database, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDate(q.Var('value')), Types.date, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDoc(q.Var('value')), Types.doc, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsFunction(q.Var('value')), Types.function, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsIndex(q.Var('value')), Types.index, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsInteger(q.Var('value')), Types.integer, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDouble(q.Var('value')), Types.double, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsKey(q.Var('value')), Types.key, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsLambda(q.Var('value')), Types.lambda, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsNull(q.Var('value')), Types.null, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsNumber(q.Var('value')), Types.number, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsObject(q.Var('value')), Types.object, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsRef(q.Var('value')), Types.ref, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsRole(q.Var('value')), Types.role, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsSet(q.Var('value')), Types.set, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsString(q.Var('value')), Types.string, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsTimestamp(q.Var('value')), Types.timestamp, q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsToken(q.Var('value')), Types.token, q.Var('t'))) },
        ],
        q.Var('t'),
      ),
    },
    q.Var('type'),
  );
}
