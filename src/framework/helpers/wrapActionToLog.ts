// types
import { ActionName } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { BiotaUDFunctionName } from "~/factory/api/udfunction";

export const WrapActionToLog = (action: ActionName, fql: any) => {
  return q.Let(
    {
      doc: fql,
      action: q.If(
        q.Select("ref", q.Var("doc"), null),
        q.Call(BiotaUDFunctionName("LogAction"), [
          q.Select("ref", q.Var("doc")),
          q.Select("ts", q.Var("doc")),
          q.Identity(),
          action
        ]),
        null
      )
    },
    {
      doc: q.Var("doc"),
      action: q.Var("action")
    }
  );
};
