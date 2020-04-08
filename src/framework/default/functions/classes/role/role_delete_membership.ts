import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role } from "~/factory/api/classes";

export const RoleDeleteMembership = UDFunction({
  name: udfunctionNameNormalized("RoleDeleteMembership"),
  body: q.Query((identity, private_key, name, resource) => role.membership.delete(q.Var("name") as string, q.Var("resource"))),
});
