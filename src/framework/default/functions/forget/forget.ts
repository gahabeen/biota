import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { WrapActionAndLog } from "~/framework/helpers/WrapActionAndLog";
import { forget } from "~/factory/api/udf/forget"

export const Forget = UDFunction({
  name: udfunctionNameNormalized("Forget"),
  // body: q.Query(q.Lambda(["userRef", "ref", "at"], WrapActionAndLog("forget", forget))),
});
