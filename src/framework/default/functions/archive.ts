// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Archive = UDFunction({
  name: "Archive",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "at"],
      WrapActionToLog(
        "archive",
        q.Update(q.Var("ref"), { data: logData.archive() })
      )
    )
  ),
  role: q.Role("augmented_user")
});
