import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const NewShortId = UDFunction({
  name: udfunctionNameNormalized("NewShortId"),
  body: q.Query((identity, collectionRef, shortids) =>
    q.Let(
      {
        validShortIDs: q.Filter(q.Var("shortids"), q.Lambda("shortid", q.Not(q.Exists(q.Ref(q.Var("collectionRef"), q.Var("shortid")))))),
        validShortID: q.Select(0, q.Var("validShortIDs"), null),
      },
      q.If(q.IsString(q.Var("validShortID")), q.Var("validShortID"), q.Abort("Couldn't find a valid short id within the list"))
    )
  ),
});
