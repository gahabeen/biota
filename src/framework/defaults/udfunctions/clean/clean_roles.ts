import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanRoles = UDFunction({
  name: udfunctionNameNormalized("CleanRoles"),
  body: q.Query(q.Lambda(["identity"], cleanFQLUDF.roles())),
});
