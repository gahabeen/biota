// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Own = UDFunction({
  name: "Own",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog("own", q.Update(q.Var("ref"), { data: logData.own() }))
    )
  ),
  role: q.Role("augmented_user")
});
