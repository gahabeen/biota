import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceDatabase = UDFunction({
  name: udfunctionNameNormalized("ReplaceDatabase"),
  body: q.Query((identity, private_key, name, options) => replaceFQLUDF.database(q.Var("name") as any, q.Var("options") as any)),
});
