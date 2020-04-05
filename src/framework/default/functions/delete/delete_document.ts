import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteDocument = UDFunction({
  name: udfunctionNameNormalized("DeleteDocument"),
  body: q.Query((identity, collection, id) => deleteFQLUDF.document(collection, id)),
});
