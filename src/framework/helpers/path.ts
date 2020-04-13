// types
// external
import { query as q } from 'faunadb';
// biota
import { stringSplit } from '~/factory/api/ql/stringSplit';
import { Fauna } from '~/../types/db';

export function pathItems(path: Fauna.Expr) {
  return q.Let(
    {
      pathArray: q.If(q.IsArray(path), q.Map(path, q.Lambda('part', q.ToString(q.Var('part')))), stringSplit(q.ToString(path))),
    },
    q.If(
      q.GT(q.Count(q.Var('pathArray')), 0),
      q.If(q.StartsWith(q.Select(0, q.Var('pathArray'), ''), '~'), q.Drop(1, q.Var('pathArray')), q.Append(q.Var('pathArray'), ['data'])),
      [],
    ),
  );
}

export function pathString(path: Fauna.Expr) {
  return q.Concat(pathItems(path), '.');
}
