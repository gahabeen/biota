import { query as q, Expr } from 'faunadb';

export function TypeOf(value: Expr) {
  return q.Let(
    {
      value,
      type: q.Let(
        [
          { t: null },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsArray(q.Var('value')), 'array', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsBoolean(q.Var('value')), 'boolean', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsBytes(q.Var('value')), 'bytes', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsCollection(q.Var('value')), 'collection', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsCredentials(q.Var('value')), 'credentials', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDatabase(q.Var('value')), 'database', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDate(q.Var('value')), 'date', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDoc(q.Var('value')), 'doc', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsFunction(q.Var('value')), 'function', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsIndex(q.Var('value')), 'index', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsInteger(q.Var('value')), 'integer', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsDouble(q.Var('value')), 'double', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsKey(q.Var('value')), 'key', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsLambda(q.Var('value')), 'lambda', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsNull(q.Var('value')), 'null', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsNumber(q.Var('value')), 'number', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsObject(q.Var('value')), 'object', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsRef(q.Var('value')), 'ref', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsRole(q.Var('value')), 'role', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsSet(q.Var('value')), 'set', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsString(q.Var('value')), 'string', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsTimestamp(q.Var('value')), 'timestamp', q.Var('t'))) },
          { t: q.If(q.IsString(q.Var('t')), q.Var('t'), q.If(q.IsToken(q.Var('value')), 'token', q.Var('t'))) },
        ],
        q.Var('t'),
      ),
    },
    q.Var('type'),
  );
}
