import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetIndex = UDFunction({
  name: udfunctionNameNormalized("ForgetIndex"),
  body: q.Query((userRef, name) => forgetFQLUDF.index(name)),
});
