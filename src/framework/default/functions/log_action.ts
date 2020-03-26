// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";

export const LogAction = UDFunction({
  name: "LogAction",
  body: q.Query(
    q.Lambda(
      ["documentRef", "ts", "userRef", "actionName"],
      q.Create(q.Collection("actions"), {
        data: {
          document: q.Var("documentRef"),
          ts: q.Var("ts"),
          user: q.Var("userRef"),
          name: q.Var("actionName")
        }
      })
    )
  )
});

