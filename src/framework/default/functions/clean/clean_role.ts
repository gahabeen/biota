import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanRole = UDFunction({
  name: udfunctionNameNormalized("CleanRole"),
  body: q.Query((identity, private_key, name) => cleanFQLUDF.role(q.Var("name") as any)),
});
