import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertIndex = UDFunction({
  name: udfunctionNameNormalized("UpsertIndex"),
  body: q.Query((identity, name, options) => upsertFQLUDF.index(name, options)),
});
