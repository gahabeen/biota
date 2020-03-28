// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";

export const Forget = UDFunction({
  name: "Forget",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "at"],
      WrapActionToLog("forget", q.Delete(q.Var("ref")))
    )
  ),
  role: q.Role("augmented_user")
});
