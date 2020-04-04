import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertDocument = UDFunction({
  name: udfunctionNameNormalized("InsertDocument"),
  body: q.Query((userRef, collection, options, id) => insertFQLUDF.document(collection, options, id)),
});
