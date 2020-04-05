import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertDatabase = UDFunction({
  name: udfunctionNameNormalized("UpsertDatabase"),
  body: q.Query((identity, name, options) => upsertFQLUDF.database(name, options)),
});
