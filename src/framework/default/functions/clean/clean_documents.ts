import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanDocuments = UDFunction({
  name: udfunctionNameNormalized("CleanDocuments"),
  body: q.Query((identity, collectionName) => cleanFQLUDF.documents(collectionName)),
});
