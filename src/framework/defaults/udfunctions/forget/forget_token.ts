import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetToken = UDFunction({
  name: udfunctionNameNormalized("ForgetToken"),
  body: q.Query(q.Lambda(["identity", "private_key", "id"], forgetFQLUDF.token(q.Var("id") as any))),
});
