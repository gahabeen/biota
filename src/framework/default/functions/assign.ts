// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Assign = UDFunction({
  name: udfunctionNameNormalized("Assign"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "data"],
      WrapActionAndLog(
        "assign",
        q.Update(q.Var("ref"), { data: logData.assign() })
      )
    )
  )
});
