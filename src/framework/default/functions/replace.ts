// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Replace = UDFunction({
  name: "Replace",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog(
        "replace",
        q.Do(
          q.Replace(q.Var("ref"), { data: q.Var("data") }),
          q.Update(q.Var("ref"), { data: logData.replace() })
        )
      )
    )
  ),
  role: q.Role("AugmentedUser")
});
