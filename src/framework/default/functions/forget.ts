// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";

export const Forget = UDFunction({
  name: udfunctionNameNormalized("Forget"),
  body: q.Query(
    q.Lambda(
      ["userRef", "ref", "at"],
      WrapActionAndLog("forget", q.Delete(q.Var("ref")))
    )
  ),

});
