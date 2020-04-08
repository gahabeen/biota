import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertDatabase = UDFunction({
  name: udfunctionNameNormalized("InsertDatabase"),
  body: q.Query((identity, private_key, name, options) => insertFQLUDF.database(name, options)),
});
