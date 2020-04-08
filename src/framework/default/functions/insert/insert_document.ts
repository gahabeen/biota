import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertDocument = UDFunction({
  name: udfunctionNameNormalized("InsertDocument"),
  body: q.Query((identity, private_key, collection, data, id) => insertFQLUDF.document(q.Var("collection") as any, q.Var("data") as any, q.Var("id") as any)),
});
