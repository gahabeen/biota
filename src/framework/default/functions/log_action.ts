// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { collectionNameNormalized } from "~/factory/classes/collection";

export const LogAction = UDFunction({
  name: udfunctionNameNormalized("LogAction"),
  body: q.Query(
    q.Lambda(
      ["options"],
      q.Let(
        {
          document: q.Select("document", q.Var("options"), null),
          identity: q.Select("identity", q.Var("options"), null),
          ts: q.Select("ts", q.Var("options"), null),
          name: q.Select("name", q.Var("options"), null),
        },
        q.Create(q.Collection(collectionNameNormalized("actions")), {
          data: {
            document: q.Var("document"),
            ts: q.Var("ts"),
            user: q.Var("identity"),
            name: q.Var("name"),
          },
        })
      )
    )
  ),
});
