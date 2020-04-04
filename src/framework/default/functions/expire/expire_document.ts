import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { expire as expireFQLUDF } from "~/factory/api/fql/udf/expire";

export const ExpireDocument = UDFunction({
  name: udfunctionNameNormalized("ExpireDocument"),
  body: q.Query((userRef, collection, id, at) => expireFQLUDF.document(collection, id, at)),
});
