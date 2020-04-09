import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanCollection = UDFunction({
  name: udfunctionNameNormalized("CleanCollection"),
  body: q.Query(q.Lambda(["identity", "private_key", "name"], cleanFQLUDF.collection(q.Var("name") as any))),
});
