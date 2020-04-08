import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceKey = UDFunction({
  name: udfunctionNameNormalized("ReplaceKey"),
  body: q.Query((identity, private_key, id, options) => replaceFQLUDF.key(id, options)),
});
