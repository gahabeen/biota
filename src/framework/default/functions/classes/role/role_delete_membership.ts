import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role } from "~/factory/api/classes";

export const RoleDeleteMembership = UDFunction({
  name: udfunctionNameNormalized("RoleDeleteMembership"),
  body: q.Query((identity, name, resource) => role.membership.delete(name, resource)),
});
