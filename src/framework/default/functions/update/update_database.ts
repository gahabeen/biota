import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateDatabase = UDFunction({
  name: udfunctionNameNormalized("UpdateDatabase"),
  body: q.Query((userRef, name, options) => updateFQLUDF.database(name, options)),
});
