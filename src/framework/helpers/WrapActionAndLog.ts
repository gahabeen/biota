import { ActionName, Fauna } from "~/../types/db";
import { query as q } from "faunadb";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { Identity } from "~/factory/api/ql";

export const CallSystemOperator = (action: Fauna.Expr) => {
  return q.Call(udfunctionNameNormalized("SystemOperator"), Identity(), action);
};

export const CallLogAction = (name: string, doc: Fauna.Expr) => {
  return q.Call(udfunctionNameNormalized("LogAction"), {
    document: q.Select("ref", doc),
    identity: Identity(),
    ts: q.Select("ts", doc),
    name,
  });
};

export const WrapActionAndLog = (action: ActionName, fql: any) => {
  return q.Let(
    {
      doc: fql,
      action: q.If(
        q.IsRef(q.Select("ref", q.Var("doc"), null)),
        q.Call(udfunctionNameNormalized("LogAction"), q.Select("ref", q.Var("doc")), q.Select("ts", q.Var("doc")), Identity(), action),
        null
      ),
    },
    {
      doc: q.Var("doc"),
      action: q.Var("action"),
    }
  );
};
