import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceUDFunction = UDFunction({
  name: udfunctionNameNormalized("ReplaceUDFunction"),
  body: q.Query((identity, name, options) => replaceFQLUDF.udfunction(name, options)),
});
