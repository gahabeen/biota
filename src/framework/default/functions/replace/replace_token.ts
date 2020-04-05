import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceToken = UDFunction({
  name: udfunctionNameNormalized("ReplaceToken"),
  body: q.Query((identity, id, options) => replaceFQLUDF.token(id, options)),
});
