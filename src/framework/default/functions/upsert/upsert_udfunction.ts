import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteUDFunction = UDFunction({
  name: udfunctionNameNormalized("UpserteUDFunction"),
  body: q.Query((userRef, name, options) => upsertFQLUDF.udfunction(name, options)),
});
