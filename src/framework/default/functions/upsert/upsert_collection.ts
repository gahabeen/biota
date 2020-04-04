import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpserteCollection = UDFunction({
  name: udfunctionNameNormalized("UpserteCollection"),
  body: q.Query((userRef, name, options) => upsertFQLUDF.collection(name, options)),
});
