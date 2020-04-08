import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateCollection = UDFunction({
  name: udfunctionNameNormalized("UpdateCollection"),
  body: q.Query((identity, private_key, name, options) => updateFQLUDF.collection(q.Var("name") as any, q.Var("options") as any)),
});
