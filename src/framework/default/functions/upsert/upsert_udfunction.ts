import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertUDFunction = UDFunction({
  name: udfunctionNameNormalized("UpsertUDFunction"),
  body: q.Query((identity, private_key, name, options) => upsertFQLUDF.udfunction(q.Var("name") as any, q.Var("options") as any)),
});
