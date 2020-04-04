import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteDocument = UDFunction({
  name: udfunctionNameNormalized("UpserteDocument"),
  body: q.Query((userRef, collection, id, options) => upsertFQLUDF.document(collection, id, options)),
});
