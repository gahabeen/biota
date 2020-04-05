import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetRole = UDFunction({
  name: udfunctionNameNormalized("ForgetRole"),
  body: q.Query((identity, name) => forgetFQLUDF.role(name)),
});
