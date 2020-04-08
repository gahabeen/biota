import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceRole = UDFunction({
  name: udfunctionNameNormalized("ReplaceRole"),
  body: q.Query((identity, private_key, name, options) => replaceFQLUDF.role(name, options)),
});
