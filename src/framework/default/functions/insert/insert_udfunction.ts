import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertUDFunction = UDFunction({
  name: udfunctionNameNormalized("InsertUDFunction"),
  body: q.Query((identity, name, options) => insertFQLUDF.udfunction(name, options)),
});
