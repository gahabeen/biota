// types
import { Fauna } from "~/../types/db";
// external
import { query as q } from "faunadb";

export function wrapDoc(refVar: string, fql: Fauna.Expr): Fauna.Expr {
  return q.Let(
    {
      doc: q.Var(refVar)
    },
    fql
  );
}
