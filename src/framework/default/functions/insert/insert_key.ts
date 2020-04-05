import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertKey = UDFunction({
  name: udfunctionNameNormalized("InsertKey"),
  body: q.Query((identity, id, options) => insertFQLUDF.key(id, options)),
});
