import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanIndexes = UDFunction({
  name: udfunctionNameNormalized("CleanIndexes"),
  body: q.Query(q.Lambda(["identity"], cleanFQLUDF.indexes())),
});
