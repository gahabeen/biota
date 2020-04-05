import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceDocument = UDFunction({
  name: udfunctionNameNormalized("ReplaceDocument"),
  body: q.Query((identity, collection, id, options) => replaceFQLUDF.document(collection, id, options)),
});
