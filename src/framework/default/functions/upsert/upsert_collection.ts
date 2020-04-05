import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertCollection = UDFunction({
  name: udfunctionNameNormalized("UpsertCollection"),
  body: q.Query((identity, name, options) => upsertFQLUDF.collection(name, options)),
});
