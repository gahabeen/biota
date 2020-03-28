// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Expire = UDFunction({
  name: "Expire",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "at"],
      WrapActionToLog(
        "expire",
        q.Update(q.Var("ref"), { data: logData.expire() })
      )
    )
  ),
  role: q.Role("augmented_user")
});
