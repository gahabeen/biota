// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Insert = UDFunction({
  name: udfunctionNameNormalized("Insert"),
  body: q.Query(
    q.Lambda(
      ["userRef", "collectionRef", "data"],
      WrapActionAndLog(
        "insert",
        q.Create(q.Var("collectionRef"), { data: logData.insert() })
      )
    )
  )
});
