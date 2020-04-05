import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateToken = UDFunction({
  name: udfunctionNameNormalized("UpdateToken"),
  body: q.Query((identity, id, options) => updateFQLUDF.token(id, options)),
});
