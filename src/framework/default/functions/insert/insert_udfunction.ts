import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertUDFunction = UDFunction({
  name: udfunctionNameNormalized("InsertUDFunction"),
  body: q.Query((identity, private_key, name, options) => insertFQLUDF.udfunction(q.Var("name") as any, q.Var("options") as any)),
});
