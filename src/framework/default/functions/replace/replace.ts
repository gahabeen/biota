// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Replace = UDFunction({
  name: udfunctionNameNormalized("Replace"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "data"],
      WrapActionAndLog(
        "replace",
        q.Do(
          q.Replace(q.Var("ref"), { data: q.Var("data") }),
          q.Update(q.Var("ref"), { data: logData.replace() })
        )
      )
    )
  ),

});
