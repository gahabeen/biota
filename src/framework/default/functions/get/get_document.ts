import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetDocument = UDFunction({
  name: udfunctionNameNormalized("GetDocument"),
  body: q.Query((userRef, collection, id) => getFQLUDF.document(collection, id)),
});
