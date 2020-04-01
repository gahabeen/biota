// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { collectionNameNormalized} from "~/factory/classes/collection";

export const LogAction = UDFunction({
  name: udfunctionNameNormalized("LogAction"),
  body: q.Query(
    q.Lambda(
      ["documentRef", "ts", "userRef", "actionName"],
      q.Create(q.Collection(collectionNameNormalized("actions")), {
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
