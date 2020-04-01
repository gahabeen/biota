// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const ChangePassword = UDFunction({
  name: udfunctionNameNormalized("ChangePassword"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "password"],
      WrapActionAndLog(
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

});
