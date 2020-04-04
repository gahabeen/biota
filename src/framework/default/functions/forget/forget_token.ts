import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetToken = UDFunction({
  name: udfunctionNameNormalized("ForgetToken"),
  body: q.Query((userRef, id) => forgetFQLUDF.token(id)),
});
