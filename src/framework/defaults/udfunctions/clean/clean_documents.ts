import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanDocuments = UDFunction({
  name: udfunctionNameNormalized("CleanDocuments"),
  body: q.Query((identity, private_key, collectionName) => cleanFQLUDF.documents(q.Var("collectionName") as any)),
});
