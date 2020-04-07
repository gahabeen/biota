import { query as q } from "faunadb";
import { expire as expireFQLUDF } from "~/factory/api/fql/udf/expire";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const ExpireDocumentAt = UDFunction({
  name: udfunctionNameNormalized("ExpireDocumentAt"),
  body: q.Query((identity, collection, id, at) => expireFQLUDF.documentAt(q.Var("collection") as string, q.Var("id"), q.Var("at"))),
});
