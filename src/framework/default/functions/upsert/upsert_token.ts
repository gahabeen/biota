import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertToken = UDFunction({
  name: udfunctionNameNormalized("UpsertToken"),
  body: q.Query((identity, id, options) => upsertFQLUDF.token(id, options)),
});
