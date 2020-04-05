import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { roleNameNormalized } from "~/factory/classes/role";

export const SystemOperator = UDFunction({
  name: udfunctionNameNormalized("SystemOperator"),
  body: q.Query(q.Lambda(["identity", "query"], q.Var("query"))),
  role: q.Role(roleNameNormalized("system")),
});
