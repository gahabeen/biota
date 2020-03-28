// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Import = UDFunction({
  name: "Import",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog(
        "import",
        q.Update(q.Var("ref"), { data: logData.import() })
      )
    )
  )
  // role: q.Role("augmented_user")
});
