import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertRole = UDFunction({
  name: udfunctionNameNormalized("UpsertRole"),
  body: q.Query(q.Lambda(["identity", "private_key", "name", "options"], upsertFQLUDF.role(q.Var("name") as string, q.Var("options")))),
});
