// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const SystemOperator = UDFunction({
  name: udfunctionNameNormalized("SystemOperator"),
  body: q.Query(q.Lambda(["identity", "query"], q.Var("query"))),
  role: q.Role("system"),
});
