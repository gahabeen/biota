// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Create = UDFunction({
  name: "Create",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog(
        "create",
        q.Update(q.Var("ref"), { data: logData.create() })
      )
    )
  ),
  role: q.Role("AugmentedUser")
});
