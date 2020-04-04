// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { logData } from "~/framework/helpers/logData";

export const Expire = UDFunction({
  name: udfunctionNameNormalized("Expire"),
  body: q.Query(q.Lambda(["userRef", "ref", "at"], WrapActionAndLog("expire", q.Update(q.Var("ref"), { data: logData.expire() }))))
});
