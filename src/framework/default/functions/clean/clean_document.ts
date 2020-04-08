import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanDocument = UDFunction({
  name: udfunctionNameNormalized("CleanDocument"),
  body: q.Query((identity, private_key, collection, id) => cleanFQLUDF.document(q.Var("collection") as any, q.Var("id") as any)),
});
