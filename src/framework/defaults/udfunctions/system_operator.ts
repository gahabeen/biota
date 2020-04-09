import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { roleNameNormalized } from "~/factory/classes/role";
import { CallIsPrivateKeyValid } from "~/framework/helpers/call_functions";

export const SystemOperator = UDFunction({
  name: udfunctionNameNormalized("SystemOperator"),
  body: q.Query(
    q.Lambda(["identity", "private_key", "query"], q.Do(CallIsPrivateKeyValid(q.Var("identity"), q.Var("private_key")), q.Var("query")))
  ),
  role: q.Role(roleNameNormalized("system")),
});
