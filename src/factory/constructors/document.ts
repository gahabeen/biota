import { query as q, Expr } from 'faunadb';

export function DocumentRef(doc: Expr) {
  return q.Let(
    {
      doc,
    },
    q.If(q.IsObject(q.Var('doc')), q.Select('ref', q.Var('doc')), null),
  );
}
