import { query as q } from "faunadb";
import { expire as expireFQLUDF } from "~/factory/api/fql/udf/expire";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const ExpireDocumentIn = UDFunction({
  name: udfunctionNameNormalized("ExpireDocumentIn"),
  body: q.Query((identity, private_key, collection, id, delayInMs) =>
    expireFQLUDF.documentIn(q.Var("collection") as string, q.Var("id"), q.Var("delayInMs") as number)
  ),
});
