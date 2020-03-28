// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Assign = UDFunction({
  name: "Assign",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog(
        "assign",
        q.Update(q.Var("ref"), { data: logData.assign() })
      )
    )
  ),
  role: q.Role("augmented_user")
});
