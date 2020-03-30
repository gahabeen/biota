// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const Import = UDFunction({
  name: "Import",
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "options"],
      WrapActionToLog(
        "import",
        q.Let(
          {
            data: q.Select("data", q.Var("options"), {}),
            credentials: q.Select("credentials", q.Var("options"), {})
          },
          q.If(
            q.Exists(q.Var("ref")),
            q.Replace(q.Var("ref"), {
              data: logData.import(),
              credentials: q.Var("credentials")
            }),
            q.Create(q.Var("ref"), {
              data: logData.import(),
              credentials: q.Var("credentials")
            })
          )
        )
      )
    )
  )
  //
});
