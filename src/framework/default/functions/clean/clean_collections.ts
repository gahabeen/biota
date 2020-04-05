import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanCollections = UDFunction({
  name: udfunctionNameNormalized("CleanCollections"),
  body: q.Query((identity) => cleanFQLUDF.collections()),
});
