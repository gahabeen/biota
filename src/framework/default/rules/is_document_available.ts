// types
// external
import { query as q } from "faunadb";
// biota
import { TS_2500_YEARS } from "~/consts";
import { Rule } from "~/factory/role/rule";

export const is_document_available = Rule({
  name: "is_document_available",
  query: q.Let(
    {
      deleted_at: q.Select(
        ["data", "_activity", "deleted_at"],
        q.Var("doc"),
        q.ToTime(TS_2500_YEARS)
      ),
      archived_at: q.Select(
        ["data", "_activity", "archived_at"],
        q.Var("doc"),
        q.ToTime(TS_2500_YEARS)
      ),
      expired_at: q.Select(
        ["data", "_activity", "expired_at"],
        q.Var("doc"),
        q.ToTime(TS_2500_YEARS)
      )
    },
    q.If(
      q.LTE(q.Var("deleted_at"), q.Var("archived_at"), q.Var("expired_at")),
      q.Var("deleted_at"),
      q.If(
        q.LTE(q.Var("archived_at"), q.Var("expired_at"), q.Var("deleted_at")),
        q.Var("archived_at"),
        q.Var("expired_at")
      )
    )
  )
});
