import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role as roleFQLUDF } from "~/factory/api/fql/udf/role";

export const RoleUpsertMembership = UDFunction({
  name: udfunctionNameNormalized("RoleUpsertMembership"),
  body: q.Query(
    q.Lambda(["identity", "private_key", "name", "membership"], roleFQLUDF.membership.upsert(q.Var("name") as string, q.Var("membership")))
  ),
});
