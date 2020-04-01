// types
import { ActionName } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { Identity } from "~/factory/api/ql";

export const WrapActionAndLog = (action: ActionName, fql: any) => {
  return q.Let(
    {
      doc: fql,
      action: q.If(
        q.IsRef(q.Select("ref", q.Var("doc"), null)),
        q.Call(
          udfunctionNameNormalized("LogAction"),
          q.Select("ref", q.Var("doc")),
          q.Select("ts", q.Var("doc")),
          Identity(),
          action
        ),
        null
      )
    },
    {
      doc: q.Var("doc"),
      action: q.Var("action")
    }
  );
};
