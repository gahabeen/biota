import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteDatabase = UDFunction({
  name: udfunctionNameNormalized("UpserteDatabase"),
  body: q.Query((userRef, name, options) => upsertFQLUDF.database(name, options)),
});
