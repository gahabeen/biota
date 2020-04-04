import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteToken = UDFunction({
  name: udfunctionNameNormalized("UpserteToken"),
  body: q.Query((userRef, id, options) => upsertFQLUDF.token(id, options)),
});
