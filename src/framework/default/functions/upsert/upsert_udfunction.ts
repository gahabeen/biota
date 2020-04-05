import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertUDFunction = UDFunction({
  name: udfunctionNameNormalized("UpsertUDFunction"),
  body: q.Query((identity, name, options) => upsertFQLUDF.udfunction(name, options)),
});
