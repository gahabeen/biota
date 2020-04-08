import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanUDFunction = UDFunction({
  name: udfunctionNameNormalized("CleanUDFunction"),
  body: q.Query((identity, private_key, name) => cleanFQLUDF.udfunction(name)),
});
