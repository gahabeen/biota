import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceIndex = UDFunction({
  name: udfunctionNameNormalized("ReplaceIndex"),
  body: q.Query((identity, private_key, name, options) => replaceFQLUDF.index(q.Var("name") as any, q.Var("options") as any)),
});
