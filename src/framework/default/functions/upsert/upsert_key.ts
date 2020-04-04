import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteKey = UDFunction({
  name: udfunctionNameNormalized("UpserteKey"),
  body: q.Query((userRef, id, options) => upsertFQLUDF.key(id, options)),
});
