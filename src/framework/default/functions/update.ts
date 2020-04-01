// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Update = UDFunction({
  name: udfunctionNameNormalized("Update"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "data"],
      WrapActionAndLog(
        "update",
        q.Update(q.Var("ref"), { data: logData.update() })
      )
    )
  ),

});
