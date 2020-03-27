// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const ChangePassword = UDFunction({
  name: "ChangePassword",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "password"],
      WrapActionToLog(
        "credentials",
        q.Update(q.Var("ref"), {
          data: logData.credentials(),
          credentials: {
            password: q.Var("password")
          }
        })
      )
    )
  ),
  role: q.Role("AugmentedUser")
});
