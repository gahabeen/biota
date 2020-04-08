import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateUDFunction = UDFunction({
  name: udfunctionNameNormalized("UpdateUDFunction"),
  body: q.Query((identity, private_key, name, options) => updateFQLUDF.udfunction(name, options)),
});
