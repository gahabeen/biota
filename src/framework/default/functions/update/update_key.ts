import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateKey = UDFunction({
  name: udfunctionNameNormalized("UpdateKey"),
  body: q.Query((identity, private_key, id, options) => updateFQLUDF.key(id, options)),
});
