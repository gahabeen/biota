import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanIndex = UDFunction({
  name: udfunctionNameNormalized("CleanIndex"),
  body: q.Query((identity, private_key, name) => cleanFQLUDF.index(name)),
});
