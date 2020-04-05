import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanKeys = UDFunction({
  name: udfunctionNameNormalized("CleanKeys"),
  body: q.Query((identity) => cleanFQLUDF.keys()),
});
