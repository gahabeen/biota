// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Delete = UDFunction({
  name: udfunctionNameNormalized("Delete"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "at"],
      WrapActionAndLog(
        "delete",
        q.Update(q.Var("ref"), { data: logData.delete() })
      )
    )
  ),

});
