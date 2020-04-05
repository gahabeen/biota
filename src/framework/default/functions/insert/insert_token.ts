import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertToken = UDFunction({
  name: udfunctionNameNormalized("InsertToken"),
  body: q.Query((identity, id, options) => insertFQLUDF.token(id, options)),
});
