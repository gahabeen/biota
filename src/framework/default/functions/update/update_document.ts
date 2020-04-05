import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateDocument = UDFunction({
  name: udfunctionNameNormalized("UpdateDocument"),
  body: q.Query((identity, collection, id, options) => updateFQLUDF.document(collection, id, options)),
});
