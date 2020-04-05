import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanUDFunctions = UDFunction({
  name: udfunctionNameNormalized("CleanUDFunctions"),
  body: q.Query((identity) => cleanFQLUDF.udfunctions()),
});
