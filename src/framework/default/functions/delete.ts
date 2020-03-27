// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Delete = UDFunction({
  name: "Delete",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "at"],
      WrapActionToLog(
        "delete",
        q.Update(q.Var("ref"), { data: logData.delete() })
      )
    )
  ),
  role: q.Role("AugmentedUser")
});
