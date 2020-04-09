import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetKey = UDFunction({
  name: udfunctionNameNormalized("ForgetKey"),
  body: q.Query(q.Lambda(["identity", "private_key", "id"], forgetFQLUDF.key(q.Var("id") as any))),
});
