import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateRole = UDFunction({
  name: udfunctionNameNormalized("UpdateRole"),
  body: q.Query((userRef, name, options) => updateFQLUDF.key(name, options)),
});
