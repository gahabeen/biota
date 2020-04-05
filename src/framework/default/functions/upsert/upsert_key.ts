import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertKey = UDFunction({
  name: udfunctionNameNormalized("UpsertKey"),
  body: q.Query((identity, id, options) => upsertFQLUDF.key(id, options)),
});
