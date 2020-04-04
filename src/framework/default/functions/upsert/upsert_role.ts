import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteRole = UDFunction({
  name: udfunctionNameNormalized("UpserteRole"),
  body: q.Query((userRef, name, options) => upsertFQLUDF.key(name, options)),
});
