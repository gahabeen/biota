import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteIndex = UDFunction({
  name: udfunctionNameNormalized("UpserteIndex"),
  body: q.Query((userRef, name, options) => upsertFQLUDF.index(name, options)),
});
