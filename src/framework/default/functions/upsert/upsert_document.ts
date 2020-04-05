import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertDocument = UDFunction({
  name: udfunctionNameNormalized("UpsertDocument"),
  body: q.Query((identity, collection, id, options) => upsertFQLUDF.document(collection, id, options)),
});
