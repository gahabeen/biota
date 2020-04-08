import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertDatabase = UDFunction({
  name: udfunctionNameNormalized("UpsertDatabase"),
  body: q.Query((identity, private_key, name, options) => upsertFQLUDF.database(q.Var("name") as any, q.Var("options") as any)),
});
