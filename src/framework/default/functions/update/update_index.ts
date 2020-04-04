import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateIndex = UDFunction({
  name: udfunctionNameNormalized("UpdateIndex"),
  body: q.Query((userRef, name, options) => updateFQLUDF.index(name, options)),
});
