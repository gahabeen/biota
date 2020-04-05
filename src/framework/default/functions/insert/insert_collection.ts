import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertCollection = UDFunction({
  name: udfunctionNameNormalized("InsertCollection"),
  body: q.Query((identity, name, options, id) => insertFQLUDF.collection(name, options)),
});